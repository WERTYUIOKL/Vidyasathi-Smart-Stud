// import { supabase } from "@/integrations/supabase/client";
// import type { Message } from "@/components/chat/streamChat";

// const db = supabase as any;
// async function currentUserId() { const { data } = await supabase.auth.getUser(); if (!data.user) throw new Error("You must be signed in."); return data.user.id; }

// export interface StoredBookmark { id: string; question: string; answer: string; subject: string; grade: string; createdAt: number; note: string; mastered: boolean; kind: "chat" | "quiz" | "note"; tags: string[]; }
// export interface StoredTask { id: string; text: string; subject: string; done: boolean; createdAt: number; priority: "low" | "medium" | "high"; dueDate?: string; }
// export interface StoredQuizAttempt { id: string; mode: "chapter" | "mock"; subject: string; chapter: string; grade: string; totalQuestions: number; correctAnswers: number; scorePercent: number; durationSeconds: number; createdAt: number; }
// export interface StoredChatSession { id: string; title: string; grade: string; board: string; subject: string; messages: Message[]; createdAt: number; updatedAt: number; }

// export async function getProfile(userId: string) {
//   const { data, error } = await db.from("profiles").select("*").eq("id", userId).maybeSingle();
//   if (error) throw error;
//   return data;
// }

// export async function updateProfile(userId: string, values: { full_name?: string; grade?: string; board?: string; preferred_language?: string }) {
//   const { data, error } = await db.from("profiles").update({ ...values, updated_at: new Date().toISOString() }).eq("id", userId).select().single();
//   if (error) throw error;
//   return data;
// }

// export async function getBookmarks(): Promise<StoredBookmark[]> {
//   const { data, error } = await db.from("bookmarks").select("*").order("created_at", { ascending: false });
//   if (error) throw error;
//   return (data || []).map((b: any) => ({ id: b.id, question: b.question, answer: b.answer, subject: b.subject, grade: b.grade, createdAt: new Date(b.created_at).getTime(), note: b.note || "", mastered: Boolean(b.mastered), kind: b.kind || "chat", tags: b.tags || [] }));
// }
// export async function addBookmark(input: Omit<StoredBookmark, "id" | "createdAt">) {
//   const user_id = await currentUserId();
//   const { data, error } = await db.from("bookmarks").insert({ user_id, question: input.question, answer: input.answer, subject: input.subject, grade: input.grade, note: input.note || "", mastered: Boolean(input.mastered), kind: input.kind || "chat", tags: input.tags || [] }).select().single();
//   if (error) throw error;
//   return data;
// }
// export async function updateBookmark(id: string, values: Partial<Pick<StoredBookmark, "note" | "mastered">>) {
//   const { error } = await db.from("bookmarks").update(values).eq("id", id); if (error) throw error;
// }
// export async function removeBookmark(id: string) { const { error } = await db.from("bookmarks").delete().eq("id", id); if (error) throw error; }

// export async function getStudyNotes() {
//   const { data, error } = await db.from("study_notes").select("*").order("created_at", { ascending: false });
//   if (error) throw error; return data || [];
// }
// export async function saveStudyNote(note: { title: string; content: string; subject?: string; grade?: string; note_type: string }) {
//   const user_id = await currentUserId();
//   const { data, error } = await db.from("study_notes").insert({ ...note, user_id }).select().single(); if (error) throw error; return data;
// }
// export async function deleteStudyNote(id: string) { const { error } = await db.from("study_notes").delete().eq("id", id); if (error) throw error; }

// export async function getQuizAttempts(): Promise<StoredQuizAttempt[]> {
//   const { data, error } = await db.from("quiz_attempts").select("*").order("created_at", { ascending: false }); if (error) throw error;
//   return (data || []).map((a: any) => ({ id: a.id, mode: a.mode, subject: a.subject, chapter: a.chapter, grade: a.grade, totalQuestions: a.total_questions, correctAnswers: a.correct_answers, scorePercent: a.score_percent, durationSeconds: a.duration_seconds, createdAt: new Date(a.created_at).getTime() }));
// }
// export async function saveQuizAttempt(attempt: Omit<StoredQuizAttempt, "id" | "createdAt" | "scorePercent">) {
//   const scorePercent = attempt.totalQuestions > 0 ? Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100) : 0;
//   const user_id = await currentUserId();
//   const { data, error } = await db.from("quiz_attempts").insert({ user_id, mode: attempt.mode, subject: attempt.subject, chapter: attempt.chapter, grade: attempt.grade, total_questions: attempt.totalQuestions, correct_answers: attempt.correctAnswers, score_percent: scorePercent, duration_seconds: attempt.durationSeconds }).select().single();
//   if (error) throw error;
//   const { error: progressError } = await db.from("study_progress").insert({ user_id, subject: attempt.subject, topic: attempt.chapter, score: scorePercent, total_questions: attempt.totalQuestions, correct_answers: attempt.correctAnswers, study_time_minutes: Math.max(1, Math.round(attempt.durationSeconds / 60)) });
//   if (progressError) console.warn("Progress save failed:", progressError.message);
//   await logActivity("quiz_completed", { subject: attempt.subject, score: scorePercent });
//   return data;
// }

// export async function getStudyPlan(): Promise<StoredTask[]> {
//   const { data, error } = await db.from("study_tasks").select("*").order("created_at", { ascending: false }); if (error) throw error;
//   return (data || []).map((t: any) => ({ id: t.id, text: t.text, subject: t.subject, done: t.done, createdAt: new Date(t.created_at).getTime(), priority: t.priority, dueDate: t.due_date || undefined }));
// }
// export async function addStudyTask(text: string, subject: string, priority: StoredTask["priority"] = "medium", dueDate?: string) { const user_id = await currentUserId(); const { data, error } = await db.from("study_tasks").insert({ user_id, text, subject, priority, due_date: dueDate || null }).select().single(); if (error) throw error; return data; }
// export async function toggleStudyTask(id: string, done: boolean) { const { error } = await db.from("study_tasks").update({ done }).eq("id", id); if (error) throw error; }
// export async function removeStudyTask(id: string) { const { error } = await db.from("study_tasks").delete().eq("id", id); if (error) throw error; }

// export async function getChatSessions(): Promise<StoredChatSession[]> {
//   const { data, error } = await db.from("chat_sessions").select("*").order("updated_at", { ascending: false }); if (error) throw error;
//   return (data || []).map((s: any) => ({ id: s.id, title: s.title, grade: s.grade, board: s.board, subject: s.subject, messages: s.messages || [], createdAt: new Date(s.created_at).getTime(), updatedAt: new Date(s.updated_at).getTime() }));
// }
// export async function saveChatSession(session: StoredChatSession) {
//   const user_id = await currentUserId();
//   const { error } = await db.from("chat_sessions").upsert({ id: session.id, user_id, title: session.title, grade: session.grade, board: session.board, subject: session.subject, messages: session.messages, created_at: new Date(session.createdAt).toISOString(), updated_at: new Date().toISOString() }); if (error) throw error;
// }
// export async function deleteChatSession(id: string) { const { error } = await db.from("chat_sessions").delete().eq("id", id); if (error) throw error; }

// export async function getProgress() {
//   const { data, error } = await db.from("study_progress").select("*").order("created_at", { ascending: false }); if (error) throw error; return data || [];
// }
// export async function logActivity(activity_type: string, metadata: Record<string, unknown> = {}) { const user_id = await currentUserId(); const { error } = await db.from("activity_log").insert({ user_id, activity_type, metadata }); if (error) throw error; }

// export async function getTeacherData() {
//   const [{ data: profiles, error: pErr }, { data: roles, error: rErr }, { data: progress, error: prErr }, { data: attempts, error: aErr }] = await Promise.all([
//     db.from("profiles").select("id,full_name,grade,board,created_at").order("created_at", { ascending: false }),
//     db.from("user_roles").select("user_id,role"),
//     db.from("study_progress").select("*").order("created_at", { ascending: false }),
//     db.from("quiz_attempts").select("*").order("created_at", { ascending: false }),
//   ]);
//   if (pErr) throw pErr; if (rErr) throw rErr; if (prErr) throw prErr; if (aErr) throw aErr;
//   const studentIds = new Set((roles || []).filter((r: any) => r.role === "student").map((r: any) => r.user_id));
//   return { profiles: (profiles || []).filter((p: any) => studentIds.has(p.id)), progress: progress || [], attempts: attempts || [] };
// }

// export interface UserDocument { id: string; file_name: string; storage_path: string; mime_type: string; file_size: number; status: "processing" | "ready" | "failed"; extracted_characters: number; created_at: string; }
// export async function listDocuments(): Promise<UserDocument[]> { const { data, error } = await db.from("user_documents").select("*").order("created_at", { ascending: false }); if (error) throw error; return data || []; }
// export async function createDocument(input: { file_name: string; storage_path: string; mime_type: string; file_size: number }) { const user_id = await currentUserId(); const { data, error } = await db.from("user_documents").insert({ ...input, user_id }).select().single(); if (error) throw error; return data as UserDocument; }
// export async function updateDocument(id: string, values: { status?: string; extracted_characters?: number }) { const { error } = await db.from("user_documents").update({ ...values, updated_at: new Date().toISOString() }).eq("id", id); if (error) throw error; }
// export async function deleteDocument(id: string, storagePath: string) { await supabase.storage.from("user-documents").remove([storagePath]); const { error } = await db.from("user_documents").delete().eq("id", id); if (error) throw error; }
// export async function saveDocumentChunks(documentId: string, chunks: string[]) { await db.from("document_chunks").delete().eq("document_id", documentId); const rows = chunks.map((content, i) => ({ document_id: documentId, chunk_index: i, content })); if (rows.length) { const { error } = await db.from("document_chunks").insert(rows); if (error) throw error; } }


import { supabase } from "@/integrations/supabase/client";
import type { Message } from "@/components/chat/streamChat";

const db = supabase as any;

async function currentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("You must be signed in.");
  }

  return data.user.id;
}

export interface StoredBookmark {
  id: string;
  question: string;
  answer: string;
  subject: string;
  grade: string;
  createdAt: number;
  note: string;
  mastered: boolean;
  kind: "chat" | "quiz" | "note";
  tags: string[];
}

export interface StoredTask {
  id: string;
  text: string;
  subject: string;
  done: boolean;
  createdAt: number;
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

export interface StoredQuizAttempt {
  id: string;
  mode: "chapter" | "mock";
  subject: string;
  chapter: string;
  grade: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercent: number;
  durationSeconds: number;
  createdAt: number;
}

export interface StoredChatSession {
  id: string;
  title: string;
  grade: string;
  board: string;
  subject: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface StoredStudyNote {
  id: string;
  title: string;
  content: string;
  subject: string;
  grade?: string | null;
  note_type: "note" | "summary" | "important_questions" | "exam_answers";
  created_at: string;
  updated_at?: string;
}

/* =========================================================
   PROFILE
========================================================= */

export async function getProfile(userId: string) {
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProfile(
  userId: string,
  values: {
    full_name?: string;
    grade?: string;
    board?: string;
    preferred_language?: string;
  }
) {
  const { data, error } = await db
    .from("profiles")
    .update({
      ...values,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/* =========================================================
   BOOKMARKS
========================================================= */

export async function getBookmarks(): Promise<StoredBookmark[]> {
  const user_id = await currentUserId();

  const { data, error } = await db
    .from("bookmarks")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map((b: any) => ({
    id: b.id,
    question: b.question,
    answer: b.answer,
    subject: b.subject,
    grade: b.grade,
    createdAt: new Date(b.created_at).getTime(),
    note: b.note || "",
    mastered: Boolean(b.mastered),
    kind: b.kind || "chat",
    tags: b.tags || [],
  }));
}

export async function addBookmark(
  input: Omit<StoredBookmark, "id" | "createdAt">
) {
  const user_id = await currentUserId();

  const { data, error } = await db
    .from("bookmarks")
    .insert({
      user_id,
      question: input.question,
      answer: input.answer,
      subject: input.subject,
      grade: input.grade,
      note: input.note || "",
      mastered: Boolean(input.mastered),
      kind: input.kind || "chat",
      tags: input.tags || [],
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateBookmark(
  id: string,
  values: Partial<Pick<StoredBookmark, "note" | "mastered">>
) {
  const user_id = await currentUserId();

  const { error } = await db
    .from("bookmarks")
    .update(values)
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) {
    throw error;
  }
}

export async function removeBookmark(id: string) {
  const user_id = await currentUserId();

  const { error } = await db
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) {
    throw error;
  }
}

/* =========================================================
   STUDY NOTES
========================================================= */

export async function getStudyNotes(): Promise<StoredStudyNote[]> {
  const user_id = await currentUserId();

  const { data, error } = await db
    .from("study_notes")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []) as StoredStudyNote[];
}

export async function saveStudyNote(note: {
  title: string;
  content: string;
  subject?: string;
  grade?: string;
  note_type:
    | "note"
    | "summary"
    | "important_questions"
    | "exam_answers";
}) {
  const user_id = await currentUserId();

  const { data, error } = await db
    .from("study_notes")
    .insert({
      user_id,
      title: note.title,
      content: note.content,
      subject: note.subject || "General",
      grade: note.grade || null,
      note_type: note.note_type,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as StoredStudyNote;
}

export async function updateStudyNote(
  id: string,
  values: {
    title?: string;
    content?: string;
    subject?: string;
    grade?: string;
    note_type?: string;
  }
) {
  const user_id = await currentUserId();

  const { data, error } = await db
    .from("study_notes")
    .update({
      ...values,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user_id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as StoredStudyNote;
}

export async function deleteStudyNote(id: string) {
  const user_id = await currentUserId();

  const { error } = await db
    .from("study_notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) {
    throw error;
  }
}

/* =========================================================
   QUIZ ATTEMPTS
========================================================= */

export async function getQuizAttempts(): Promise<StoredQuizAttempt[]> {
  const user_id = await currentUserId();

  const { data, error } = await db
    .from("quiz_attempts")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map((a: any) => ({
    id: a.id,
    mode: a.mode,
    subject: a.subject,
    chapter: a.chapter,
    grade: a.grade,
    totalQuestions: a.total_questions,
    correctAnswers: a.correct_answers,
    scorePercent: a.score_percent,
    durationSeconds: a.duration_seconds,
    createdAt: new Date(a.created_at).getTime(),
  }));
}

export async function saveQuizAttempt(
  attempt: Omit<StoredQuizAttempt, "id" | "createdAt" | "scorePercent">
) {
  const scorePercent =
    attempt.totalQuestions > 0
      ? Math.round(
          (attempt.correctAnswers / attempt.totalQuestions) * 100
        )
      : 0;

  const user_id = await currentUserId();

  const { data, error } = await db
    .from("quiz_attempts")
    .insert({
      user_id,
      mode: attempt.mode,
      subject: attempt.subject,
      chapter: attempt.chapter,
      grade: attempt.grade,
      total_questions: attempt.totalQuestions,
      correct_answers: attempt.correctAnswers,
      score_percent: scorePercent,
      duration_seconds: attempt.durationSeconds,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  /*
   * study_progress is optional in the current database setup.
   * We therefore don't let a missing progress table prevent
   * the quiz attempt itself from being saved.
   */
  try {
    const { error: progressError } = await db
      .from("study_progress")
      .insert({
        user_id,
        subject: attempt.subject,
        topic: attempt.chapter,
        score: scorePercent,
        total_questions: attempt.totalQuestions,
        correct_answers: attempt.correctAnswers,
        study_time_minutes: Math.max(
          1,
          Math.round(attempt.durationSeconds / 60)
        ),
      });

    if (progressError) {
      console.warn(
        "Progress save failed:",
        progressError.message
      );
    }
  } catch (error) {
    console.warn("Progress save failed:", error);
  }

  try {
    await logActivity("quiz_completed", {
      subject: attempt.subject,
      score: scorePercent,
    });
  } catch (error) {
    console.warn("Activity logging failed:", error);
  }

  return data;
}

/* =========================================================
   STUDY PLAN / TASKS
========================================================= */

export async function getStudyPlan(): Promise<StoredTask[]> {
  const user_id = await currentUserId();

  const { data, error } = await db
    .from("study_tasks")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map((t: any) => ({
    id: t.id,
    text: t.text,
    subject: t.subject,
    done: t.done,
    createdAt: new Date(t.created_at).getTime(),
    priority: t.priority,
    dueDate: t.due_date || undefined,
  }));
}

export async function addStudyTask(
  text: string,
  subject: string,
  priority: StoredTask["priority"] = "medium",
  dueDate?: string
) {
  const user_id = await currentUserId();

  const { data, error } = await db
    .from("study_tasks")
    .insert({
      user_id,
      text,
      subject,
      priority,
      due_date: dueDate || null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function toggleStudyTask(id: string, done: boolean) {
  const user_id = await currentUserId();

  const { error } = await db
    .from("study_tasks")
    .update({ done })
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) {
    throw error;
  }
}

export async function removeStudyTask(id: string) {
  const user_id = await currentUserId();

  const { error } = await db
    .from("study_tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) {
    throw error;
  }
}

/* =========================================================
   CHAT SESSIONS
========================================================= */

export async function getChatSessions(): Promise<StoredChatSession[]> {
  const user_id = await currentUserId();

  const { data, error } = await db
    .from("chat_sessions")
    .select("*")
    .eq("user_id", user_id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map((s: any) => ({
    id: s.id,
    title: s.title,
    grade: s.grade,
    board: s.board,
    subject: s.subject,
    messages: s.messages || [],
    createdAt: new Date(s.created_at).getTime(),
    updatedAt: new Date(s.updated_at).getTime(),
  }));
}

export async function saveChatSession(session: StoredChatSession) {
  const user_id = await currentUserId();

  const { error } = await db
    .from("chat_sessions")
    .upsert({
      id: session.id,
      user_id,
      title: session.title,
      grade: session.grade,
      board: session.board,
      subject: session.subject,
      messages: session.messages,
      created_at: new Date(session.createdAt).toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (error) {
    throw error;
  }
}

export async function deleteChatSession(id: string) {
  const user_id = await currentUserId();

  const { error } = await db
    .from("chat_sessions")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) {
    throw error;
  }
}

/* =========================================================
   PROGRESS
========================================================= */

export async function getProgress() {
  const user_id = await currentUserId();

  const { data, error } = await db
    .from("study_progress")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

/* =========================================================
   ACTIVITY
========================================================= */

export async function logActivity(
  activity_type: string,
  metadata: Record<string, unknown> = {}
) {
  const user_id = await currentUserId();

  const { error } = await db
    .from("activity_log")
    .insert({
      user_id,
      activity_type,
      metadata,
    });

  if (error) {
    throw error;
  }
}

/* =========================================================
   TEACHER DATA
========================================================= */

export async function getTeacherData() {
  const [
    { data: profiles, error: pErr },
    { data: roles, error: rErr },
    { data: progress, error: prErr },
    { data: attempts, error: aErr },
  ] = await Promise.all([
    db
      .from("profiles")
      .select("id,full_name,grade,board,created_at")
      .order("created_at", { ascending: false }),

    db.from("user_roles").select("user_id,role"),

    db
      .from("study_progress")
      .select("*")
      .order("created_at", { ascending: false }),

    db
      .from("quiz_attempts")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  if (pErr) throw pErr;
  if (rErr) throw rErr;
  if (prErr) throw prErr;
  if (aErr) throw aErr;

  const studentIds = new Set(
    (roles || [])
      .filter((r: any) => r.role === "student")
      .map((r: any) => r.user_id)
  );

  return {
    profiles: (profiles || []).filter((p: any) =>
      studentIds.has(p.id)
    ),
    progress: progress || [],
    attempts: attempts || [],
  };
}

/* =========================================================
   DOCUMENTS
========================================================= */

export interface UserDocument {
  id: string;
  file_name: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  status: "processing" | "ready" | "failed";
  extracted_characters: number;
  created_at: string;
}

export async function listDocuments(): Promise<UserDocument[]> {
  const user_id = await currentUserId();

  const { data, error } = await db
    .from("user_documents")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function createDocument(input: {
  file_name: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
}) {
  const user_id = await currentUserId();

  const { data, error } = await db
    .from("user_documents")
    .insert({
      ...input,
      user_id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as UserDocument;
}

export async function updateDocument(
  id: string,
  values: {
    status?: string;
    extracted_characters?: number;
  }
) {
  const user_id = await currentUserId();

  const { error } = await db
    .from("user_documents")
    .update({
      ...values,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) {
    throw error;
  }
}

export async function deleteDocument(
  id: string,
  storagePath: string
) {
  const user_id = await currentUserId();

  const { error: storageError } = await supabase.storage
    .from("user-documents")
    .remove([storagePath]);

  if (storageError) {
    console.warn(
      "Storage delete failed:",
      storageError.message
    );
  }

  const { error } = await db
    .from("user_documents")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) {
    throw error;
  }
}

export async function saveDocumentChunks(
  documentId: string,
  chunks: string[]
) {
  const user_id = await currentUserId();

  const { error: deleteError } = await db
    .from("document_chunks")
    .delete()
    .eq("document_id", documentId);

  if (deleteError) {
    throw deleteError;
  }

  if (!chunks.length) {
    return;
  }

  const rows = chunks.map((content, i) => ({
    document_id: documentId,
    chunk_index: i,
    content,
  }));

  const { error: insertError } = await db
    .from("document_chunks")
    .insert(rows);

  if (insertError) {
    throw insertError;
  }
}