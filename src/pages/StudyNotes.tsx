// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { FileText, Plus, Trash2, Sparkles, BookOpen, ClipboardList, HelpCircle } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "sonner";
// import { useAuth } from "@/hooks/useAuth";
// import { deleteStudyNote, getStudyNotes, saveStudyNote, type NoteType, type StoredStudyNote } from "@/lib/studyNotes";

// type NoteTypeConfig = { value: NoteType; label: string; icon: typeof FileText };

// const NOTE_TYPES: NoteTypeConfig[] = [
//   { value: "note", label: "Notes", icon: FileText },
//   { value: "summary", label: "Summary", icon: BookOpen },
//   { value: "important_questions", label: "Important Qs", icon: HelpCircle },
//   { value: "exam_answers", label: "Exam Answers", icon: ClipboardList },
// ];

// const SUBJECTS = ["Science", "Mathematics", "Physics", "Chemistry", "Geography", "English", "Hindi", "Marathi"];

// const StudyNotes = () => {
//   const [notes, setNotes] = useState<StoredStudyNote[]>([]);
//   const [activeType, setActiveType] = useState<NoteType>("note");
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [subject, setSubject] = useState(SUBJECTS[0]);
//   const [generating, setGenerating] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const { user } = useAuth();

//   const fetchNotes = async () => {
//     try { const storedNotes = (await getStudyNotes()).filter((note) => note.note_type === activeType); setNotes(storedNotes as StoredStudyNote[]); }
//     catch (e) { toast.error(e instanceof Error ? e.message : "Could not load notes"); }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, [activeType, user]);

//   const handleSaveNote = async () => {
//     if (!title.trim() || !content.trim()) return;

//     try { await saveStudyNote({ title: title.trim(), content: content.trim(), subject, note_type: activeType }); toast.success("Saved!"); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not save note"); return; }
//     setTitle("");
//     setContent("");
//     setShowForm(false);
//     fetchNotes();
//   };

//   const handleDeleteNote = async (id: string) => {
//     try { await deleteStudyNote(id); await fetchNotes(); } catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
//   };

//   const generateWithAI = async (type: NoteType) => {
//     if (!subject) return;
//     setGenerating(true);
//     try {
//       const prompts: Record<NoteType, string> = {
//         note: `Create detailed study notes for ${subject} (Maharashtra Board). Include key concepts, definitions, and formulas.`,
//         summary: `Create a concise chapter summary for ${subject} (Maharashtra Board). Highlight the most important points.`,
//         important_questions: `List the most important questions for ${subject} (Maharashtra Board) exam. Include 2-mark, 3-mark, and 5-mark questions.`,
//         exam_answers: `Write model exam answers for important questions in ${subject} (Maharashtra Board). Include step-by-step solutions.`,
//       };

//       const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
//         },
//         body: JSON.stringify({
//           messages: [{ role: "user", content: prompts[type] }],
//           board: "SSC",
//           subject,
//         }),
//       });

//       if (!resp.ok) throw new Error("AI generation failed");

//       const reader = resp.body!.getReader();
//       const decoder = new TextDecoder();
//       let result = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         const text = decoder.decode(value, { stream: true });
//         for (const line of text.split("\n")) {
//           if (!line.startsWith("data: ")) continue;
//           const json = line.slice(6).trim();
//           if (json === "[DONE]") continue;
//           try {
//             const parsed = JSON.parse(json);
//             const c = parsed.choices?.[0]?.delta?.content;
//             if (c) result += c;
//           } catch {}
//         }
//       }

//       setTitle(`${NOTE_TYPES.find((t) => t.value === type)?.label} - ${subject}`);
//       setContent(result);
//       setShowForm(true);
//     } catch {
//       toast.error("Failed to generate. Try again.");
//     } finally {
//       setGenerating(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <div className="container mx-auto max-w-4xl px-4 py-8">
//         <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">📚 Study Tools</h1>
//         <p className="mb-6 font-body text-muted-foreground">Create notes, summaries, and practice questions with AI.</p>

//         <div className="mb-6 flex flex-wrap gap-2">
//           {NOTE_TYPES.map((type) => (
//             <Button
//               key={type.value}
//               variant={activeType === type.value ? "default" : "outline"}
//               size="sm"
//               onClick={() => setActiveType(type.value)}
//               className="gap-1.5 font-heading text-xs"
//             >
//               <type.icon className="h-3.5 w-3.5" />
//               {type.label}
//             </Button>
//           ))}
//         </div>

//         <div className="mb-6 flex flex-wrap items-center gap-2">
//           <select
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             className="rounded-lg border bg-background px-3 py-2 font-heading text-sm text-foreground"
//           >
//             {SUBJECTS.map((item) => (
//               <option key={item} value={item}>
//                 {item}
//               </option>
//             ))}
//           </select>
//           <Button
//             onClick={() => generateWithAI(activeType)}
//             disabled={generating}
//             className="gap-1.5 font-heading text-sm"
//             variant="secondary"
//           >
//             <Sparkles className="h-4 w-4" />
//             {generating ? "Generating..." : `Generate ${NOTE_TYPES.find((t) => t.value === activeType)?.label}`}
//           </Button>
//           <Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm" className="gap-1 font-heading text-xs">
//             <Plus className="h-3.5 w-3.5" />
//             Add Manually
//           </Button>
//         </div>

//         {showForm && (
//           <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 space-y-3 rounded-xl border bg-card p-4">
//             <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="font-heading" />
//             <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content..." rows={8} className="font-body text-sm" />
//             <div className="flex gap-2">
//               <Button onClick={handleSaveNote} className="font-heading text-sm">Save</Button>
//               <Button onClick={() => setShowForm(false)} variant="ghost" className="font-heading text-sm">Cancel</Button>
//             </div>
//           </motion.div>
//         )}

//         {notes.length === 0 ? (
//           <div className="py-12 text-center">
//             <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
//             <p className="font-heading text-sm text-muted-foreground">No {NOTE_TYPES.find((t) => t.value === activeType)?.label.toLowerCase()} yet.</p>
//             <p className="mt-1 font-heading text-xs text-muted-foreground">Use AI to generate or add manually.</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {notes.map((note) => (
//               <motion.div key={note.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group rounded-xl border bg-card p-4">
//                 <div className="flex items-start justify-between gap-2">
//                   <div className="min-w-0 flex-1">
//                     <h3 className="truncate font-heading text-sm font-semibold text-foreground">{note.title}</h3>
//                     <div className="mt-1 flex items-center gap-2">
//                       {note.subject && <span className="rounded-full bg-secondary px-2 py-0.5 font-heading text-[10px] text-secondary-foreground">{note.subject}</span>}
//                       <span className="font-heading text-[10px] text-muted-foreground">{new Date(note.created_at).toLocaleDateString()}</span>
//                     </div>
//                     <p className="mt-2 line-clamp-3 whitespace-pre-wrap font-body text-xs text-muted-foreground">{note.content}</p>
//                   </div>
//                   <button onClick={() => handleDeleteNote(note.id)} className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100">
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudyNotes;



import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  ClipboardList,
  HelpCircle,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

import {
  deleteStudyNote,
  getStudyNotes,
  saveStudyNote,
  type NoteType,
  type StoredStudyNote,
} from "@/lib/studyNotes";

type NoteTypeConfig = {
  value: NoteType;
  label: string;
  icon: typeof FileText;
};

const NOTE_TYPES: NoteTypeConfig[] = [
  {
    value: "note",
    label: "Notes",
    icon: FileText,
  },
  {
    value: "summary",
    label: "Summary",
    icon: BookOpen,
  },
  {
    value: "important_questions",
    label: "Important Qs",
    icon: HelpCircle,
  },
  {
    value: "exam_answers",
    label: "Exam Answers",
    icon: ClipboardList,
  },
];

const SUBJECTS = [
  "Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Geography",
  "English",
  "Hindi",
  "Marathi",
];

const StudyNotes = () => {
  const [notes, setNotes] = useState<StoredStudyNote[]>([]);
  const [activeType, setActiveType] =
    useState<NoteType>("note");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] =
    useState(SUBJECTS[0]);

  const [generating, setGenerating] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const { user } = useAuth();

  /* =======================================================
     LOAD NOTES
  ======================================================= */

  const fetchNotes = async () => {
    if (!user) {
      setNotes([]);
      return;
    }

    setLoading(true);

    try {
      const storedNotes =
        await getStudyNotes();

      const filteredNotes =
        storedNotes
          .filter(
            (note) =>
              note.note_type === activeType
          )
          .sort(
            (a, b) =>
              new Date(
                b.created_at
              ).getTime() -
              new Date(
                a.created_at
              ).getTime()
          );

      setNotes(filteredNotes);
    } catch (error) {
      console.error(
        "Failed to load notes:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load notes"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD WHEN USER / NOTE TYPE CHANGES
  ======================================================= */

  useEffect(() => {
    fetchNotes();
  }, [activeType, user]);

  /* =======================================================
     SAVE NOTE
  ======================================================= */

  const handleSaveNote = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title.");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter note content.");
      return;
    }

    try {
      await saveStudyNote({
        title: title.trim(),
        content: content.trim(),
        subject,
        note_type: activeType,
      });

      toast.success("Note saved successfully!");

      setTitle("");
      setContent("");
      setShowForm(false);

      await fetchNotes();
    } catch (error) {
      console.error(
        "Failed to save note:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not save note"
      );
    }
  };

  /* =======================================================
     DELETE NOTE
  ======================================================= */

  const handleDeleteNote = async (
    id: string
  ) => {
    try {
      await deleteStudyNote(id);

      toast.success(
        "Note deleted successfully!"
      );

      await fetchNotes();
    } catch (error) {
      console.error(
        "Failed to delete note:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Delete failed"
      );
    }
  };

  /* =======================================================
     AI GENERATION
  ======================================================= */

  const generateWithAI = async (
    type: NoteType
  ) => {
    if (!subject) {
      toast.error("Please select a subject.");
      return;
    }

    setGenerating(true);

    try {
      const prompts: Record<
        NoteType,
        string
      > = {
        note: `Create detailed study notes for ${subject} (Maharashtra Board). Include key concepts, definitions, and formulas.`,

        summary: `Create a concise chapter summary for ${subject} (Maharashtra Board). Highlight the most important points.`,

        important_questions: `List the most important questions for ${subject} (Maharashtra Board) exam. Include 2-mark, 3-mark, and 5-mark questions.`,

        exam_answers: `Write model exam answers for important questions in ${subject} (Maharashtra Board). Include step-by-step solutions.`,
      };

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },

          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: prompts[type],
              },
            ],
            board: "SSC",
            subject,
          }),
        }
      );

      if (!resp.ok) {
        throw new Error(
          `AI generation failed (${resp.status})`
        );
      }

      if (!resp.body) {
        throw new Error(
          "AI response body is empty."
        );
      }

      const reader =
        resp.body.getReader();

      const decoder =
        new TextDecoder();

      let result = "";

      while (true) {
        const {
          done,
          value,
        } = await reader.read();

        if (done) break;

        const text =
          decoder.decode(value, {
            stream: true,
          });

        for (const line of text.split(
          "\n"
        )) {
          if (!line.startsWith("data: ")) {
            continue;
          }

          const json =
            line.slice(6).trim();

          if (json === "[DONE]") {
            continue;
          }

          try {
            const parsed =
              JSON.parse(json);

            const generatedContent =
              parsed.choices?.[0]
                ?.delta?.content;

            if (generatedContent) {
              result += generatedContent;
            }
          } catch {
            // Ignore incomplete stream chunks.
          }
        }
      }

      if (!result.trim()) {
        throw new Error(
          "AI returned an empty response."
        );
      }

      setTitle(
        `${
          NOTE_TYPES.find(
            (t) => t.value === type
          )?.label
        } - ${subject}`
      );

      setContent(result);
      setShowForm(true);

      toast.success(
        "Content generated. Review it and click Save."
      );
    } catch (error) {
      console.error(
        "AI generation failed:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate. Try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-4xl px-4 py-8">

        <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">
          📚 Study Tools
        </h1>

        <p className="mb-6 font-body text-muted-foreground">
          Create notes, summaries, and practice
          questions with AI.
        </p>

        {/* NOTE TYPES */}

        <div className="mb-6 flex flex-wrap gap-2">
          {NOTE_TYPES.map((type) => (
            <Button
              key={type.value}
              variant={
                activeType === type.value
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                setActiveType(type.value)
              }
              className="gap-1.5 font-heading text-xs"
            >
              <type.icon className="h-3.5 w-3.5" />

              {type.label}
            </Button>
          ))}
        </div>

        {/* SUBJECT / ACTIONS */}

        <div className="mb-6 flex flex-wrap items-center gap-2">

          <select
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
            className="rounded-lg border bg-background px-3 py-2 font-heading text-sm text-foreground"
          >
            {SUBJECTS.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <Button
            onClick={() =>
              generateWithAI(activeType)
            }
            disabled={generating}
            className="gap-1.5 font-heading text-sm"
            variant="secondary"
          >
            <Sparkles className="h-4 w-4" />

            {generating
              ? "Generating..."
              : `Generate ${
                  NOTE_TYPES.find(
                    (t) =>
                      t.value === activeType
                  )?.label
                }`}
          </Button>

          <Button
            onClick={() =>
              setShowForm(!showForm)
            }
            variant="outline"
            size="sm"
            className="gap-1 font-heading text-xs"
          >
            <Plus className="h-3.5 w-3.5" />

            Add Manually
          </Button>
        </div>

        {/* FORM */}

        {showForm && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 space-y-3 rounded-xl border bg-card p-4"
          >
            <Input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Title"
              className="font-heading"
            />

            <Textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Content..."
              rows={8}
              className="font-body text-sm"
            />

            <div className="flex gap-2">

              <Button
                onClick={handleSaveNote}
                className="font-heading text-sm"
              >
                Save
              </Button>

              <Button
                onClick={() => {
                  setShowForm(false);
                  setTitle("");
                  setContent("");
                }}
                variant="ghost"
                className="font-heading text-sm"
              >
                Cancel
              </Button>

            </div>
          </motion.div>
        )}

        {/* NOTES */}

        {loading ? (
          <div className="py-12 text-center">
            <p className="font-heading text-sm text-muted-foreground">
              Loading notes...
            </p>
          </div>
        ) : notes.length === 0 ? (
          <div className="py-12 text-center">

            <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />

            <p className="font-heading text-sm text-muted-foreground">
              No{" "}
              {NOTE_TYPES.find(
                (t) =>
                  t.value === activeType
              )
                ?.label.toLowerCase()}{" "}
              yet.
            </p>

            <p className="mt-1 font-heading text-xs text-muted-foreground">
              Use AI to generate or add manually.
            </p>

          </div>
        ) : (
          <div className="space-y-3">

            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="group rounded-xl border bg-card p-4"
              >

                <div className="flex items-start justify-between gap-2">

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate font-heading text-sm font-semibold text-foreground">
                      {note.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-2">

                      {note.subject && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 font-heading text-[10px] text-secondary-foreground">
                          {note.subject}
                        </span>
                      )}

                      <span className="font-heading text-[10px] text-muted-foreground">
                        {new Date(
                          note.created_at
                        ).toLocaleDateString()}
                      </span>

                    </div>

                    <p className="mt-2 line-clamp-3 whitespace-pre-wrap font-body text-xs text-muted-foreground">
                      {note.content}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      handleDeleteNote(
                        note.id
                      )
                    }
                    className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                </div>

              </motion.div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default StudyNotes;