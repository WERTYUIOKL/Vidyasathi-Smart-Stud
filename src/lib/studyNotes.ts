import * as db from "@/lib/db";
export type NoteType = "note" | "summary" | "important_questions" | "exam_answers";
export interface StoredStudyNote { id: string; title: string; content: string; subject: string; grade?: string | null; note_type: NoteType; created_at: string; updated_at?: string; }
export const getStudyNotes = db.getStudyNotes;
export const saveStudyNote = db.saveStudyNote;
export const deleteStudyNote = db.deleteStudyNote;
