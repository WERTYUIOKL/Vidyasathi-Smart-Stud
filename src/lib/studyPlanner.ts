import * as db from "@/lib/db";
export type StudyTask = db.StoredTask;
export const getStudyPlan = db.getStudyPlan;
export const addStudyTask = db.addStudyTask;
export async function toggleStudyTask(id: string, currentDone: boolean) { return db.toggleStudyTask(id, !currentDone); }
export const removeStudyTask = db.removeStudyTask;
