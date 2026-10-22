import { FileText, BookOpen } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type TextbookLink = { subject: string; title: string; driveId?: string; pdfUrl?: string };

const TEXTBOOK_LINKS: Record<string, TextbookLink[]> = {
  "10": [
    { subject: "Science", title: "Science & Technology Part 1", driveId: "1OgizKNSK4e7zadVxWuIElwoCJsBlCW74" },
    { subject: "Science", title: "Science & Technology Part 2", driveId: "13KCGD6qGYEF8V9VNvAuivNJf8kG4CUcd" },
    { subject: "Mathematics", title: "Mathematics Part 1", driveId: "1Tt75XfG8PqliJ_mrhvchs3rKMKyy49lq" },
    { subject: "Mathematics", title: "Mathematics Part 2", driveId: "1-x3XCgQSKDSE6UHGYPjUVhKWiPvLTlti" },
    { subject: "Social Science", title: "History & Political Science", driveId: "1Ub_r7OsUk-c22UUOHVEPVzxTt2XoOwuL" },
    { subject: "Social Science", title: "Geography", driveId: "1nNjpA3L2ATYe8DRW1Ko5iNLNMSReYTdx" },
    { subject: "Geography", title: "Geography", driveId: "1nNjpA3L2ATYe8DRW1Ko5iNLNMSReYTdx" },
    { subject: "English", title: "English Kumarbharati", driveId: "1EX_X0nqBR7E8IY5hnuUFUnYjDmOO7fZm" },
    { subject: "Hindi", title: "Hindi Lokbharati", driveId: "18rjpYoFJ6F3CKtBg263fGgrjTegmpNxx" },
    { subject: "Marathi", title: "Marathi Kumarbharati", pdfUrl: "https://mpscmaterial.com/wp-content/uploads/2021/09/1.-10th-STD-Marathi-textbook-pdf-kumarbharti21.pdf" },
  ],
  "12": [
    { subject: "Physics", title: "Physics", driveId: "1Za2o763QYvtfgN6TWhgxsdYgFdN8kTjG" },
    { subject: "Chemistry", title: "Chemistry", driveId: "10bQSGHhOZwM54abop57Ob0YadXY2pq7T" },
    { subject: "Mathematics", title: "Mathematics & Statistics Part 1", driveId: "1eO9XYNxzlAeE52p54DbbTxr0wyq9dWSt" },
    { subject: "Mathematics", title: "Mathematics & Statistics Part 2", driveId: "1QCHP9wGru1F-w6xwl18NJmiLRKyIOq-r" },
    { subject: "Biology", title: "Biology", driveId: "16bmAc_-yYH_c2KOveOwX9CQNH4KNFFg2" },
    { subject: "Geography", title: "Geography", pdfUrl: "https://mpscmaterial.com/wp-content/uploads/2021/09/2.-Geography-Book-for-Class-12th-in-English.pdf" },
    { subject: "English", title: "English Yuvakbharati", driveId: "1SuBKDhMsikVopfsbfusk0i2qUPBMmL7L" },
  ],
};

type Props = {
  grade: string;
  subject: string;
};

const TextbookLinks = ({ grade, subject }: Props) => {
  const navigate = useNavigate();

  if (!subject) return null;

  const links = TEXTBOOK_LINKS[grade]?.filter((l) => l.subject === subject) || [];
  if (links.length === 0) return null;

  const openTextbook = (link: TextbookLink) => {
    let embedUrl: string;
    if (link.driveId) {
      embedUrl = `https://drive.google.com/file/d/${link.driveId}/preview`;
    } else if (link.pdfUrl) {
      embedUrl = `https://docs.google.com/gview?url=${encodeURIComponent(link.pdfUrl)}&embedded=true`;
    } else {
      return;
    }
    navigate(`/textbook?url=${encodeURIComponent(embedUrl)}&title=${encodeURIComponent(link.title)}`);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="border-b bg-gradient-to-r from-secondary/50 to-accent/10 px-4 py-3"
      >
        <div className="container mx-auto max-w-2xl">
          <div className="mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-accent" />
            <span className="font-heading text-xs font-semibold text-foreground">
              📚 {subject} Textbooks — Maharashtra Board
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {links.map((link) => (
              <button
                key={link.title}
                onClick={() => openTextbook(link)}
                className="group flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-2 font-heading text-xs font-medium text-foreground shadow-sm transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
              >
                <FileText className="h-3.5 w-3.5 text-primary transition-colors group-hover:text-primary-foreground" />
                {link.title}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TextbookLinks;
