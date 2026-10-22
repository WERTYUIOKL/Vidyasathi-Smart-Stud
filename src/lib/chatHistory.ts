import { type Message } from "@/components/chat/streamChat";
import * as db from "@/lib/db";
export type ChatSession = db.StoredChatSession;
export const generateId = () => crypto.randomUUID();
export const getChatSessions = db.getChatSessions;
export const saveChatSession = db.saveChatSession;
export const deleteChatSession = db.deleteChatSession;
export function getTitleFromMessages(messages: Message[]): string { const firstUser = messages.find((m) => m.role === "user"); return firstUser ? firstUser.content.slice(0, 50) + (firstUser.content.length > 50 ? "..." : "") : "New Chat"; }
