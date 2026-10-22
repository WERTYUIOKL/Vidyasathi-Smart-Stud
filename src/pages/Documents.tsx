import { useEffect, useState } from "react";
import { FileText, FileUp, Trash2, Loader2, CheckCircle2, AlertCircle, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createDocument, deleteDocument, listDocuments, saveDocumentChunks, updateDocument, type UserDocument } from "@/lib/db";
import { useAuth } from "@/hooks/useAuth";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "text/plain", "text/markdown"];

function chunkText(text: string, size = 1800) { const clean = text.replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim(); const chunks: string[] = []; for (let i = 0; i < clean.length; i += size) chunks.push(clean.slice(i, i + size)); return chunks.filter(Boolean); }
async function extractPdf(file: File) { if (!window.pdfjsLib) throw new Error("PDF parser is unavailable. Check your internet connection."); window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js"; const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise; let out = ""; for (let page = 1; page <= pdf.numPages; page++) { const p = await pdf.getPage(page); const c = await p.getTextContent(); out += c.items.map((i: any) => i.str || "").join(" ") + "\n"; } return out; }
async function extractDocx(file: File) { if (!window.mammoth) throw new Error("DOCX parser is unavailable. Check your internet connection."); const result = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() }); return result.value || ""; }
async function extractPptx(file: File) { if (!window.JSZip) throw new Error("PPTX parser is unavailable. Check your internet connection."); const zip = await window.JSZip.loadAsync(await file.arrayBuffer()); const names = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/i.test(n)).sort((a,b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0])); let out = ""; for (const name of names) { const xml = await zip.files[name].async("text"); const doc = new DOMParser().parseFromString(xml, "application/xml"); const texts = Array.from(doc.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "t")).map((n) => n.textContent || ""); out += texts.join(" ") + "\n"; } return out; }
async function extractText(file: File) { if (file.type === "text/plain" || file.type === "text/markdown" || /\.(txt|md)$/i.test(file.name)) return file.text(); if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) return extractPdf(file); if (/\.docx$/i.test(file.name)) return extractDocx(file); if (/\.pptx$/i.test(file.name)) return extractPptx(file); throw new Error("Unsupported document format."); }

export default function Documents() {
  const { user } = useAuth(); const [docs, setDocs] = useState<UserDocument[]>([]); const [busy, setBusy] = useState(false);
  const refresh = async () => { try { setDocs(await listDocuments()); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not load documents"); } };
  useEffect(() => { refresh(); }, []);
  const handleFiles = async (files: FileList | null) => { if (!files || !user) return; setBusy(true); try {
    for (const file of Array.from(files)) {
      if (!allowed.includes(file.type) && !/\.(pdf|docx|pptx|txt|md)$/i.test(file.name)) { toast.error(`${file.name}: unsupported format`); continue; }
      if (file.size > MAX_FILE_SIZE) { toast.error(`${file.name}: maximum size is 25 MB`); continue; }
      const path = `${user.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: uploadError } = await supabase.storage.from("user-documents").upload(path, file, { upsert: false }); if (uploadError) throw uploadError;
      const doc = await createDocument({ file_name: file.name, storage_path: path, mime_type: file.type || "application/octet-stream", file_size: file.size });
      try { const text = await extractText(file); const chunks = chunkText(text); if (!chunks.length) throw new Error("No readable text was found in this document."); await saveDocumentChunks(doc.id, chunks); await updateDocument(doc.id, { status: "ready", extracted_characters: text.length }); toast.success(`${file.name} uploaded and processed.`); }
      catch (error) { await updateDocument(doc.id, { status: "failed", extracted_characters: 0 }); toast.error(`${file.name}: ${error instanceof Error ? error.message : "Could not extract text"}`); }
    }
    await refresh();
  } catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed"); } finally { setBusy(false); } };
  const remove = async (doc: UserDocument) => { try { await deleteDocument(doc.id, doc.storage_path); await refresh(); toast.success("Document deleted."); } catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); } };
  const download = async (doc: UserDocument) => { const { data, error } = await supabase.storage.from("user-documents").createSignedUrl(doc.storage_path, 300); if (error) return toast.error(error.message); window.open(data.signedUrl, "_blank", "noopener,noreferrer"); };
  return <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto max-w-5xl px-4 py-8"><div className="mb-7"><h1 className="font-heading text-3xl font-bold">📄 My Documents</h1><p className="mt-1 text-muted-foreground">Upload PDF, DOCX, PPTX or text study material. Files are private to your account.</p></div>
    <label className="mb-7 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card px-6 py-12 text-center hover:bg-secondary/30"><FileUp className="mb-3 h-10 w-10 text-primary" /><span className="font-heading font-semibold">{busy ? "Uploading and processing..." : "Choose study documents"}</span><span className="mt-1 text-xs text-muted-foreground">Maximum 25 MB per file</span><input className="hidden" type="file" multiple accept=".pdf,.docx,.pptx,.txt,.md" disabled={busy} onChange={e => { handleFiles(e.target.files); e.currentTarget.value = ""; }} /></label>
    <div className="space-y-3">{docs.map(doc => <div key={doc.id} className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4"><div className="flex min-w-0 items-center gap-3"><FileText className="h-8 w-8 shrink-0 text-primary" /><div className="min-w-0"><p className="truncate font-heading text-sm font-semibold">{doc.file_name}</p><p className="text-xs text-muted-foreground">{(doc.file_size / 1024 / 1024).toFixed(2)} MB • {doc.extracted_characters.toLocaleString()} extracted characters</p></div></div><div className="flex items-center gap-2"><span className="hidden items-center gap-1 text-xs sm:flex">{doc.status === "ready" ? <><CheckCircle2 className="h-4 w-4 text-accent" /> Ready</> : doc.status === "failed" ? <><AlertCircle className="h-4 w-4 text-destructive" /> Failed</> : <><Loader2 className="h-4 w-4 animate-spin" /> Processing</>}</span><Button size="icon" variant="ghost" onClick={() => download(doc)} title="Download"><Download className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => remove(doc)} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button></div></div>)}{docs.length === 0 && <div className="rounded-xl border bg-card py-12 text-center text-sm text-muted-foreground">No documents uploaded yet.</div>}</div>
  </div></div>;
}
