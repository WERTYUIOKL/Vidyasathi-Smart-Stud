import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceInput } from "@/components/VoiceInput";

type Props = {
  input: string;
  isLoading: boolean;
  onInputChange: (v: string) => void;
  onSend: () => void;
};

const ChatInput = ({ input, isLoading, onInputChange, onSend }: Props) => (
  <div className="border-t bg-background px-4 py-4">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      className="container mx-auto flex max-w-2xl gap-2"
    >
      <VoiceInput
        onTranscript={(text) => {
          onInputChange(text);
        }}
        language="en"
      />
      <input
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Ask your question..."
        className="flex-1 rounded-xl border bg-card px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <Button type="submit" disabled={!input.trim() || isLoading} size="icon" className="h-12 w-12 rounded-xl">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  </div>
);

export default ChatInput;
