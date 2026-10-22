import * as db from "@/lib/db";
export type Bookmark = db.StoredBookmark;
export const getBookmarks = db.getBookmarks;
export const addBookmark = db.addBookmark;
export const removeBookmark = db.removeBookmark;
export async function updateBookmarkNote(id: string, note: string) { await db.updateBookmark(id, { note: note.trim() }); }
export async function toggleBookmarkMastered(id: string, current?: boolean) { await db.updateBookmark(id, { mastered: !(current ?? false) }); }
