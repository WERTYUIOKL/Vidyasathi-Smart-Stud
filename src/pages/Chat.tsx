import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Loader2, Bookmark } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatFilters from "@/components/chat/ChatFilters";
import ChatInput from "@/components/chat/ChatInput";
import TextbookLinks from "@/components/chat/TextbookLinks";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { streamChat, type Message } from "@/components/chat/streamChat";
import {
  getChatSessions,
  saveChatSession,
  deleteChatSession,
  getTitleFromMessages,
  generateId,
  type ChatSession,
} from "@/lib/chatHistory";
import { addBookmark } from "@/lib/bookmarks";

const SUBJECTS_BY_GRADE: Record<string, string[]> = {
  "10": ["Science", "Mathematics", "Geography", "Social Science", "English", "Hindi", "Marathi"],
  "12": ["Physics", "Chemistry", "Mathematics", "Biology", "Geography", "English"],
};
const GRADES = [
  { label: "10th (SSC)", board: "SSC", grade: "10" },
  { label: "12th (HSC)", board: "HSC", grade: "12" },
];

const SUGGESTED_QUESTIONS: Record<string, Record<string, string[]>> = {
  "10": {
    "": ["Explain photosynthesis in simple terms", "What is the Pythagorean theorem?", "Explain Newton's laws of motion", "What are acids, bases and salts?", "Explain the Indian National Movement"],
    Science: ["Explain photosynthesis in simple terms", "What is the structure of an atom?", "How does the human digestive system work?", "What are acids, bases and salts?"],
    Mathematics: ["What is the Pythagorean theorem?", "Explain quadratic equations", "What is trigonometry?", "How to find the area of a circle?"],
    Physics: ["Explain Newton's laws of motion", "What is Ohm's Law?", "How does electromagnetic induction work?"],
    Chemistry: ["What are acids, bases and salts?", "Explain chemical bonding", "What is the periodic table?"],
    "Social Science": ["Explain the Indian National Movement", "What is the French Revolution?", "How does Indian democracy work?"],
    English: ["Summarize the lesson 'A Letter to God'", "What are the main figures of speech?", "How to write a formal letter?"],
    Hindi: ["हिंदी व्याकरण में संज्ञा क्या है?", "पत्र लेखन कैसे करें?", "समास के प्रकार समझाइए"],
    Marathi: ["मराठी व्याकरणातील नाम म्हणजे काय?", "निबंध लेखन कसे करावे?", "अलंकार म्हणजे काय?"],
  },
  "12": {
    "": ["Explain electrostatics and Coulomb's law", "What is differentiation in calculus?", "Explain the Dual Nature of Radiation", "What are p-block elements?", "Describe the structure of Indian Parliament"],
    Physics: ["Explain electrostatics and Coulomb's law", "Explain the Dual Nature of Radiation", "What is electromagnetic induction?", "How do semiconductors work?"],
    Chemistry: ["What are p-block elements?", "Explain chemical kinetics", "What are coordination compounds?", "Describe electrochemistry"],
    Mathematics: ["What is differentiation in calculus?", "Explain integration and its applications", "What are matrices and determinants?", "Explain probability distributions"],
    Science: ["Explain genetics and heredity", "What is molecular biology?", "How does evolution work?"],
    Biology: ["Explain genetics and heredity", "What is molecular biology?", "How does evolution work?", "What is biotechnology?"],
    "Social Science": ["Describe the structure of Indian Parliament", "What is globalisation?", "Explain the Cold War era"],
    English: ["What is a sonnet?", "Explain direct and indirect speech", "How to write a report?"],
  },
};

function getWelcomeMessage(grade: string): string {
  if (grade === "12") {
    return "Namaste! 🙏 I'm VidyaSathi, your personal tutor. I have knowledge of **HSC 12th** textbooks covering Physics, Chemistry, Mathematics, Biology, Social Science, and English.\n\nSelect your subject above, then ask me anything!";
  }
  return "Namaste! 🙏 I'm VidyaSathi, your personal tutor. I have knowledge of **SSC 10th** textbooks covering Science, Maths, Physics, Chemistry, Social Science, and English.\n\nSelect your subject above, then ask me anything!";
}

const Chat = () => {
  const { toast } = useToast();
  const [selectedGrade, setSelectedGrade] = useState(GRADES[0]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: getWelcomeMessage(GRADES[0].grade) },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Chat history
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const refreshSessions = useCallback(async () => { try { setSessions(await getChatSessions()); } catch (e) { console.error(e); } }, []);

  useEffect(() => { refreshSessions(); }, [refreshSessions]);

  const handleGradeChange = (g: typeof GRADES[number]) => {
    setSelectedGrade(g);
    setSelectedSubject("");
    setMessages([{ role: "assistant", content: getWelcomeMessage(g.grade) }]);
    setActiveSessionId(null);
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Prevent page-level scrolling on chat route; keep scrolling inside chat containers
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    const seedTextbooks = async () => {
      setIsSeeding(true);
      try {
        const { data, error } = await supabase.functions.invoke("seed-textbooks");
        if (error) console.error("Seed error:", error);
      } catch (e) {
        console.error("Seed failed:", e);
      } finally {
        setIsSeeding(false);
      }
    };
    seedTextbooks();
  }, []);

  // Save session when messages change (after user messages)
  useEffect(() => {
    const userMsgs = messages.filter((m) => m.role === "user");
    if (userMsgs.length === 0) return;
    const id = activeSessionId || generateId();
    if (!activeSessionId) setActiveSessionId(id);
    const session: ChatSession = {
      id,
      title: getTitleFromMessages(messages),
      grade: selectedGrade.grade,
      board: selectedGrade.board,
      subject: selectedSubject,
      messages,
      createdAt: sessions.find((s) => s.id === id)?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    void saveChatSession(session).then(() => refreshSessions()).catch(console.error);
  }, [messages]);

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([{ role: "assistant", content: getWelcomeMessage(selectedGrade.grade) }]);
  };

  const handleSelectSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    const grade = GRADES.find((g) => g.grade === session.grade) || GRADES[0];
    setSelectedGrade(grade);
    setSelectedSubject(session.subject);
  };

  const handleDeleteSession = (id: string) => {
    void deleteChatSession(id).then(() => refreshSessions()).catch(console.error);
    if (activeSessionId === id) handleNewChat();
  };

  const handleBookmark = (userMsg: Message, assistantMsg: Message) => {
    void addBookmark({
      question: userMsg.content,
      answer: assistantMsg.content,
      subject: selectedSubject || "General",
      grade: selectedGrade.grade,
      note: "", mastered: false, kind: "chat", tags: [selectedSubject || "General"],
    }).catch(console.error);
    toast({ title: "Bookmarked! 🔖", description: "Saved to your bookmarks." });
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        board: selectedGrade.board,
        grade: selectedGrade.grade,
        subject: selectedSubject || undefined,
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
        onError: (err) => {
          toast({ title: "Error", description: err, variant: "destructive" });
          setIsLoading(false);
        },
      });
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to get response", variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-layout flex h-dvh flex-col overflow-hidden bg-background">
      <div className="shrink-0"><Navbar /></div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <SidebarProvider className="h-full min-h-0 w-full" style={{ height: "100%" }}>
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
          />
          <div className="flex min-h-0 flex-1 flex-col min-w-0">
            <div className="flex items-center bg-background">
              <SidebarTrigger className="mx-2 shrink-0" />
              <div className="min-w-0 flex-1">
                <ChatFilters
                  grades={GRADES}
                  subjects={SUBJECTS_BY_GRADE[selectedGrade.grade] || []}
                  selectedGrade={selectedGrade}
                  selectedSubject={selectedSubject}
                  onGradeChange={handleGradeChange}
                  onSubjectChange={setSelectedSubject}
                />
              </div>
            </div>
            <TextbookLinks grade={selectedGrade.grade} subject={selectedSubject} />

            {isSeeding && (
              <div className="border-b bg-secondary px-4 py-2 text-center">
                <span className="flex items-center justify-center gap-2 font-heading text-xs text-secondary-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading textbook data...
                </span>
              </div>
            )}

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div ref={messagesContainerRef} className="chat-messages-scroll h-0 min-h-0 flex-1 overflow-y-auto px-4 py-6" data-chat-scroll="messages">
                <div className="container mx-auto max-w-2xl space-y-4">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                      <div key={i} className="group relative">
                        <ChatMessage role={msg.role} content={msg.content} />
                        {msg.role === "assistant" && i > 0 && messages[i - 1]?.role === "user" && (
                          <button
                            onClick={() => handleBookmark(messages[i - 1], msg)}
                            className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-card border p-1.5 shadow-sm hover:bg-secondary"
                            title="Bookmark this answer"
                          >
                            <Bookmark className="h-3.5 w-3.5 text-primary" />
                          </button>
                        )}
                      </div>
                    ))}
                  </AnimatePresence>

                  {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-[var(--shadow-card)]">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {messages.length <= 1 && (
                <div className="border-t bg-background px-4 py-3">
                  <div className="container mx-auto flex max-w-2xl flex-wrap gap-2">
                    {(SUGGESTED_QUESTIONS[selectedGrade.grade]?.[selectedSubject] || SUGGESTED_QUESTIONS[selectedGrade.grade]?.[""] || []).map((q) => (
                      <button key={q} onClick={() => handleSend(q)} className="rounded-full border bg-card px-3 py-1.5 font-heading text-xs font-medium text-foreground transition-colors hover:bg-secondary">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <ChatInput input={input} isLoading={isLoading} onInputChange={setInput} onSend={() => handleSend()} />
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default Chat;
