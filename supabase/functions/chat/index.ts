import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple hash for cache lookup
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, board, grade, subject } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";
    
    // Normalize question for caching
    const normalizedQ = lastUserMessage.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");
    const questionHash = simpleHash(`${normalizedQ}|${board || ""}|${grade || ""}|${subject || ""}`);

    // Check cache first — saves API cost
    const { data: cached } = await supabase
      .from("cached_responses")
      .select("answer")
      .eq("question_hash", questionHash)
      .maybeSingle();

    if (cached?.answer) {
      // Increment hit count in background
      supabase
        .from("cached_responses")
        .update({ updated_at: new Date().toISOString() })
        .eq("question_hash", questionHash)
        .then(() => {})
        .catch(() => {});
      
      // Return cached answer as a fake SSE stream for consistent client handling
      const encoder = new TextEncoder();
      const body = encoder.encode(
        `data: ${JSON.stringify({ choices: [{ delta: { content: cached.answer } }] })}\n\ndata: [DONE]\n\n`
      );
      return new Response(body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // Get embedding for the user's question
    const embeddingResponse = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: lastUserMessage,
        dimensions: 768,
      }),
    });

    let contextText = "";

    if (embeddingResponse.ok) {
      const embData = await embeddingResponse.json();
      const queryEmbedding = embData.data?.[0]?.embedding;

      if (queryEmbedding) {
        const { data: chunks, error } = await supabase.rpc("search_textbook_chunks", {
          query_embedding: queryEmbedding,
          match_count: 5,
          filter_board: board || null,
          filter_grade: grade || null,
          filter_subject: subject || null,
        });

        if (!error && chunks && chunks.length > 0) {
          contextText = chunks
            .map((c: any) => `[${c.board} ${c.grade}th - ${c.subject} - ${c.chapter}]\n${c.content}`)
            .join("\n\n---\n\n");
        }
      }
    } else {
      console.error("Embedding API error:", await embeddingResponse.text());
    }

    // Fallback: text search
    if (!contextText) {
      const { data: fallbackChunks } = await supabase
        .from("textbook_chunks")
        .select("content, chapter, textbook_id, textbooks!inner(subject, grade, board)")
        .textSearch("content", lastUserMessage.split(" ").slice(0, 5).join(" & "), { type: "plain" })
        .limit(5);

      if (fallbackChunks && fallbackChunks.length > 0) {
        contextText = fallbackChunks
          .map((c: any) => `[${c.textbooks.board} ${c.textbooks.grade}th - ${c.textbooks.subject} - ${c.chapter}]\n${c.content}`)
          .join("\n\n---\n\n");
      }
    }

    // Last fallback: general content
    if (!contextText) {
      const query = supabase
        .from("textbook_chunks")
        .select("content, chapter, textbook_id, textbooks!inner(subject, grade, board)")
        .limit(3);

      if (subject) query.eq("textbooks.subject", subject);
      if (grade) query.eq("textbooks.grade", grade);

      const { data: generalChunks } = await query;
      if (generalChunks && generalChunks.length > 0) {
        contextText = generalChunks
          .map((c: any) => `[${c.textbooks.board} ${c.textbooks.grade}th - ${c.textbooks.subject} - ${c.chapter}]\n${c.content}`)
          .join("\n\n---\n\n");
      }
    }

    const systemPrompt = `You are VidyaSathi, an AI tutor for Indian students studying SSC (10th) and HSC (12th) board exams (Maharashtra Board).

Your role:
- Answer questions accurately based on the textbook content provided below
- **IMPORTANT: Always provide your explanation in BOTH English AND Hindi.** First explain in English, then add a section "## हिंदी में समझाइए (Hindi Explanation)" and explain the same concept in simple Hindi (Devanagari script)
- Explain concepts in simple, clear language that students can understand
- Use examples relevant to Indian students
- If the textbook content is relevant, cite the chapter and subject
- Be encouraging and patient like a good teacher
- For math/science, show step-by-step solutions using markdown formatting
- Use **bold**, *italics*, bullet points, and headers to structure your answers clearly
- If you don't have relevant textbook content, still try to help but mention that the answer is from your general knowledge

${contextText ? `TEXTBOOK REFERENCE MATERIAL:\n${contextText}` : "No specific textbook content found for this query. Answer from your general knowledge about Indian SSC/HSC curriculum."}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream through and collect full response for caching
    const reader = response.body!.getReader();
    let fullAnswer = "";
    
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
            
            // Parse to collect full answer for caching
            const text = decoder.decode(value, { stream: true });
            for (const line of text.split("\n")) {
              if (!line.startsWith("data: ")) continue;
              const jsonStr = line.slice(6).trim();
              if (jsonStr === "[DONE]") continue;
              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) fullAnswer += content;
              } catch { /* ignore */ }
            }
          }
          controller.close();
          
          // Cache the response in background (only for single-turn questions)
          if (messages.length <= 2 && fullAnswer.length > 20) {
            supabase.from("cached_responses").upsert({
              question_hash: questionHash,
              question: lastUserMessage,
              answer: fullAnswer,
              board: board || null,
              grade: grade || null,
              subject: subject || null,
            }, { onConflict: "question_hash" }).then(() => {}).catch(() => {});
          }
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
