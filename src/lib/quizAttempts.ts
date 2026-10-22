import * as db from "@/lib/db";
export type QuizAttemptMode = "chapter" | "mock";
export type QuizAttempt = db.StoredQuizAttempt;
export const getQuizAttempts = db.getQuizAttempts;
export const saveQuizAttempt = db.saveQuizAttempt;
