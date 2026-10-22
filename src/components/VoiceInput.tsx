import { forwardRef, useState, useRef, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: "en" | "hi";
}

let activeSpeechKey: string | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

const getSpeechKey = (text: string, lang: "en" | "hi") => `${lang}:${text}`;

const stripMarkdown = (text: string) =>
  text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[>*_~\-]+/g, " ")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

export const getSpeakableText = (text: string, lang: "en" | "hi") => {
  const normalized = stripMarkdown(text).slice(0, 3000);
  if (lang === "en") {
    const englishSection = normalized
      .split(/हिंदी में समझाइए|Hindi Explanation/i)[0]
      ?.replace(/[\u0900-\u097F]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return (englishSection || normalized).slice(0, 3000);
  }

  const hindiHeadingMatch = text.match(/(?:##\s*)?हिंदी में समझाइए[\s\S]*$/i);
  const hindiSection = hindiHeadingMatch?.[0] ?? text;
  const devanagariMatches = hindiSection.match(/[\u0900-\u097F][\u0900-\u097F\s,.;:!?()"'“”‘’\-]*/g) ?? [];
  const combinedHindi = devanagariMatches.join(" ").replace(/\s+/g, " ").trim();

  return (combinedHindi || stripMarkdown(hindiSection)).slice(0, 3000);
};

const waitForVoices = () =>
  new Promise<SpeechSynthesisVoice[]>((resolve) => {
    const synth = window.speechSynthesis;
    const existingVoices = synth.getVoices();
    if (existingVoices.length > 0) {
      resolve(existingVoices);
      return;
    }

    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      synth.removeEventListener("voiceschanged", handleVoicesChanged);
      resolve(synth.getVoices());
    };

    const handleVoicesChanged = () => {
      if (synth.getVoices().length > 0) finish();
    };

    synth.addEventListener("voiceschanged", handleVoicesChanged);
    window.setTimeout(finish, 1200);
  });

const getBestVoice = async (lang: "en" | "hi") => {
  const voices = await waitForVoices();
  const preferredLocales = lang === "hi" ? ["hi-IN", "hi"] : ["en-US", "en-IN", "en-GB", "en"];

  for (const locale of preferredLocales) {
    const exactMatch = voices.find((voice) => voice.lang.toLowerCase() === locale.toLowerCase());
    if (exactMatch) return exactMatch;
  }

  for (const locale of preferredLocales) {
    const partialMatch = voices.find((voice) => voice.lang.toLowerCase().startsWith(locale.toLowerCase()));
    if (partialMatch) return partialMatch;
  }

  if (lang === "hi") {
    const hindiNameMatch = voices.find((voice) => /hindi|bharat|india/i.test(`${voice.name} ${voice.lang}`));
    if (hindiNameMatch) return hindiNameMatch;
  }

  return null;
};

export const VoiceInput = forwardRef<HTMLButtonElement, VoiceInputProps>(({ onTranscript, language = "en" }, ref) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "hi" ? "hi-IN" : "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setListening(false);
    };

    recognition.onerror = () => {
      toast.error("Could not recognize speech. Try again.");
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [language, onTranscript]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return (
    <Button
      ref={ref}
      type="button"
      variant={listening ? "destructive" : "outline"}
      size="icon"
      onClick={listening ? stopListening : startListening}
      className="shrink-0"
      title={listening ? "Stop recording" : "Voice input"}
    >
      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
});

VoiceInput.displayName = "VoiceInput";

export const speakText = async (text: string, lang: "en" | "hi" = "en") => {
  if (!("speechSynthesis" in window)) {
    toast.error("Text-to-speech not supported.");
    return;
  }

  const synth = window.speechSynthesis;
  const cleanText = getSpeakableText(text, lang);
  if (!cleanText) return;

  const speechKey = getSpeechKey(cleanText, lang);
  if ((synth.speaking || synth.pending) && activeSpeechKey === speechKey) {
    synth.cancel();
    activeUtterance = null;
    activeSpeechKey = null;
    return;
  }

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;

  const selectedVoice = await getBestVoice(lang);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang || utterance.lang;
  }

  activeUtterance = utterance;

  utterance.onstart = () => {
    activeSpeechKey = speechKey;
  };

  utterance.onend = () => {
    if (activeUtterance === utterance) activeUtterance = null;
    if (activeSpeechKey === speechKey) activeSpeechKey = null;
  };

  utterance.onerror = (event) => {
    if (activeUtterance === utterance) activeUtterance = null;
    if (activeSpeechKey === speechKey) activeSpeechKey = null;
    const message =
      lang === "hi"
        ? event.error === "language-unavailable" || event.error === "voice-unavailable"
          ? "Hindi voice is not available on this device/browser."
          : "Hindi speech could not be played."
        : "Speech could not be played.";
    toast.error(message);
  };

  window.setTimeout(() => {
    synth.speak(utterance);
  }, 60);
};
