import { Bot, User, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { getSpeakableText, speakText } from "@/components/VoiceInput";

type Props = {
  role: "user" | "assistant";
  content: string;
};

const ChatMessage = ({ role, content }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`flex gap-3 ${role === "user" ? "flex-row-reverse" : ""}`}
  >
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        role === "assistant" ? "bg-primary" : "bg-accent"
      }`}
    >
      {role === "assistant" ? (
        <Bot className="h-4 w-4 text-primary-foreground" />
      ) : (
        <User className="h-4 w-4 text-accent-foreground" />
      )}
    </div>
    <div
      className={`max-w-[80%] rounded-2xl px-4 py-3 font-body text-sm leading-relaxed ${
        role === "assistant"
          ? "bg-card text-card-foreground shadow-[var(--shadow-card)]"
          : "bg-primary text-primary-foreground"
      }`}
    >
      {role === "assistant" ? (
        <>
          <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-heading prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          {content.length > 20 && (
            <div className="mt-2 flex gap-1 border-t border-border/50 pt-2">
              <button
                onClick={() => speakText(content, "en")}
                className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-heading text-muted-foreground hover:bg-muted transition-colors"
                title="Listen in English"
                disabled={getSpeakableText(content, "en").length < 10}
              >
                <Volume2 className="h-3 w-3" /> EN
              </button>
              <button
                onClick={() => speakText(content, "hi")}
                className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-heading text-muted-foreground hover:bg-muted transition-colors"
                title="Listen in Hindi"
                disabled={getSpeakableText(content, "hi").length < 5}
              >
                <Volume2 className="h-3 w-3" /> HI
              </button>
            </div>
          )}
        </>
      ) : (
        <span className="whitespace-pre-wrap">{content}</span>
      )}
    </div>
  </motion.div>
);

export default ChatMessage;
