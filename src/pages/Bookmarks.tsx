import { useEffect, useMemo, useState } from "react";
import { Bookmark, CheckCircle2, Search, StickyNote, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getBookmarks, removeBookmark, toggleBookmarkMastered, updateBookmarkNote, type Bookmark as BookmarkType } from "@/lib/bookmarks";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [showMasteredOnly, setShowMasteredOnly] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const refreshBookmarks = async () => { try { setBookmarks(await getBookmarks()); } catch (e) { console.error(e); } };
  useEffect(() => { refreshBookmarks(); }, []);

  const handleDelete = async (id: string) => { await removeBookmark(id); await refreshBookmarks(); };

  const handleSaveNote = async (id: string) => { await updateBookmarkNote(id, noteText); setEditingNote(null); await refreshBookmarks(); };

  const subjects = useMemo(
    () => ["All", ...Array.from(new Set(bookmarks.map((bookmark) => bookmark.subject)))],
    [bookmarks],
  );

  const filtered = bookmarks.filter((bookmark) => {
    const matchesSearch =
      bookmark.question.toLowerCase().includes(search.toLowerCase()) ||
      bookmark.subject.toLowerCase().includes(search.toLowerCase()) ||
      (bookmark.note || "").toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter === "All" || bookmark.subject === subjectFilter;
    const matchesMastered = !showMasteredOnly || bookmark.mastered;

    return matchesSearch && matchesSubject && matchesMastered;
  });

  const stats = {
    total: bookmarks.length,
    mastered: bookmarks.filter((bookmark) => bookmark.mastered).length,
    withNotes: bookmarks.filter((bookmark) => Boolean(bookmark.note)).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">🔖 Bookmarks & Notes</h1>
        <p className="mb-6 font-body text-muted-foreground">Turn saved answers into a focused revision hub with notes, filters, and mastered topics.</p>

        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: "Saved", value: stats.total },
            { label: "Mastered", value: stats.mastered },
            { label: "With Notes", value: stats.withNotes },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border bg-card p-3 text-center shadow-[var(--shadow-card)]">
              <div className="font-heading text-xl font-bold text-foreground">{item.value}</div>
              <div className="font-heading text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookmarks, subjects, or notes..."
            className="w-full rounded-lg border bg-card py-2.5 pl-10 pr-4 font-heading text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2 font-heading text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <Button variant={showMasteredOnly ? "default" : "outline"} onClick={() => setShowMasteredOnly((value) => !value)} className="font-heading text-xs">
            {showMasteredOnly ? "Showing mastered" : "Show mastered only"}
          </Button>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Bookmark className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="font-heading text-muted-foreground">
              {bookmarks.length === 0 ? "No bookmarks yet. Save answers from your chats!" : "No bookmarks match your filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((bookmark) => (
                <motion.div
                  key={bookmark.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-heading text-[10px] font-semibold text-primary">{bookmark.subject}</span>
                        <span className="font-heading text-[10px] text-muted-foreground">{bookmark.grade}th</span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 font-heading text-[10px] text-secondary-foreground">{bookmark.kind || "chat"}</span>
                      </div>
                      <p className="mb-2 font-heading text-sm font-semibold text-foreground">{bookmark.question}</p>
                      <div className="prose prose-sm max-h-32 overflow-hidden text-xs text-muted-foreground">
                        <ReactMarkdown>{bookmark.answer.slice(0, 320) + (bookmark.answer.length > 320 ? "..." : "")}</ReactMarkdown>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => {
                          toggleBookmarkMastered(bookmark.id, bookmark.mastered);
                          refreshBookmarks();
                        }}
                        className={`rounded-full border p-1.5 transition-colors ${bookmark.mastered ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
                        aria-label={bookmark.mastered ? "Mark as not mastered" : "Mark as mastered"}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(bookmark.id)} className="text-muted-foreground transition-colors hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {editingNote === bookmark.id ? (
                    <div className="mt-3 border-t pt-3">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add your study note..."
                        rows={2}
                        className="w-full resize-none rounded-lg border bg-background p-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" onClick={() => handleSaveNote(bookmark.id)} className="font-heading text-xs">Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingNote(null)} className="font-heading text-xs">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-start gap-2 border-t pt-3">
                      {bookmark.note ? (
                        <p className="flex-1 font-body text-xs italic text-muted-foreground">📝 {bookmark.note}</p>
                      ) : bookmark.mastered ? (
                        <p className="flex-1 font-body text-xs text-accent">✅ Marked as mastered for faster revision.</p>
                      ) : null}
                      <button
                        onClick={() => {
                          setEditingNote(bookmark.id);
                          setNoteText(bookmark.note || "");
                        }}
                        className="flex shrink-0 items-center gap-1 font-heading text-xs text-primary hover:underline"
                      >
                        <StickyNote className="h-3 w-3" />
                        {bookmark.note ? "Edit note" : "Add note"}
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;