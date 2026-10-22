import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Brain, CheckCircle2, Clock, FlaskConical, Layers3, RotateCcw, Sparkles, Trophy, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QUIZZES, type QuizQuestion, type SubjectQuiz } from "@/lib/quizData";
import { saveQuizAttempt } from "@/lib/quizAttempts";

type QuizState = "select" | "playing" | "result";
type PlayMode = "chapter" | "mock";
type ActiveQuestion = QuizQuestion & { subject: string; chapter: string };

const MOCK_TEST_CONFIGS = [
  { label: "10th Class Mock Test", grade: "10th", subjects: ["Science", "Mathematics", "Geography", "Social Science", "English", "Hindi", "Marathi"], durationMinutes: 12, questionCount: 12 },
  { label: "12th Class Mock Test", grade: "12th", subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Geography", "English"], durationMinutes: 15, questionCount: 15 },
] as const;

const GRADE_10_SUBJECTS = new Set(["Science", "Mathematics", "Geography", "Social Science", "English", "Hindi", "Marathi"]);
const GRADE_12_SUBJECTS = new Set(["Physics", "Chemistry", "Mathematics", "Biology", "Geography", "English"]);

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const getSubjectGrade = (subject: string) => {
  if (GRADE_10_SUBJECTS.has(subject) && !GRADE_12_SUBJECTS.has(subject)) return "10th";
  if (GRADE_12_SUBJECTS.has(subject) && !GRADE_10_SUBJECTS.has(subject)) return "12th";
  return "General";
};

const Quiz = () => {
  const [state, setState] = useState<QuizState>("select");
  const [playMode, setPlayMode] = useState<PlayMode>("chapter");
  const [selectedSubject, setSelectedSubject] = useState<SubjectQuiz | null>(null);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [activeGrade, setActiveGrade] = useState("General");
  const [questions, setQuestions] = useState<ActiveQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedDuration, setFinishedDuration] = useState(0);
  const attemptSaved = useRef(false);

  const quizSummary = useMemo(() => {
    const totalSubjects = QUIZZES.length;
    const totalChapters = QUIZZES.reduce((sum, quiz) => sum + quiz.chapters.length, 0);
    const totalQuestions = QUIZZES.reduce((sum, quiz) => sum + quiz.chapters.reduce((chapterSum, chapter) => chapterSum + chapter.questions.length, 0), 0);
    return { totalSubjects, totalChapters, totalQuestions };
  }, []);

  const beginSession = useCallback((payload: {
    mode: PlayMode;
    subject: SubjectQuiz | null;
    chapter: string;
    grade: string;
    questionList: ActiveQuestion[];
    durationSeconds: number | null;
  }) => {
    attemptSaved.current = false;
    setPlayMode(payload.mode);
    setSelectedSubject(payload.subject);
    setSelectedChapter(payload.chapter);
    setActiveGrade(payload.grade);
    setQuestions(payload.questionList);
    setCurrentQ(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setTimeLeft(payload.durationSeconds);
    setStartedAt(Date.now());
    setFinishedDuration(0);
    setState("playing");
  }, []);

  const startQuiz = useCallback((subject: SubjectQuiz, chapterName: string) => {
    const chapter = subject.chapters.find((item) => item.name === chapterName);
    if (!chapter) return;

    beginSession({
      mode: "chapter",
      subject,
      chapter: chapterName,
      grade: getSubjectGrade(subject.subject),
      questionList: chapter.questions.map((question) => ({ ...question, subject: subject.subject, chapter: chapterName })),
      durationSeconds: null,
    });
  }, [beginSession]);

  const startMockTest = useCallback((config: (typeof MOCK_TEST_CONFIGS)[number]) => {
    const pool = QUIZZES
      .filter((quiz) => config.subjects.some((subject) => subject === quiz.subject))
      .flatMap((quiz) => quiz.chapters.flatMap((chapter) => chapter.questions.map((question) => ({ ...question, subject: quiz.subject, chapter: chapter.name }))));

    beginSession({
      mode: "mock",
      subject: null,
      chapter: config.label,
      grade: config.grade,
      questionList: shuffle(pool).slice(0, config.questionCount),
      durationSeconds: config.durationMinutes * 60,
    });
  }, [beginSession]);

  useEffect(() => {
    if (state !== "playing" || timeLeft === null || timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value === null) return value;
        if (value <= 1) {
          window.clearInterval(timer);
          setFinishedDuration(startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : 0);
          setState("result");
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [startedAt, state, timeLeft]);

  useEffect(() => {
    if (state !== "result" || attemptSaved.current || questions.length === 0) return;

    void saveQuizAttempt({
      mode: playMode,
      subject: playMode === "mock" ? `${activeGrade} Mock Test` : selectedSubject?.subject || "General",
      chapter: selectedChapter,
      grade: activeGrade,
      totalQuestions: questions.length,
      correctAnswers: score,
      durationSeconds: finishedDuration,
    });
    attemptSaved.current = true;
  }, [activeGrade, finishedDuration, playMode, questions, score, selectedChapter, selectedSubject, state]);

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
    if (index === questions[currentQ].correct) setScore((value) => value + 1);
    setAnswers((value) => [...value, index]);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setFinishedDuration(startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : 0);
      setState("result");
      return;
    }

    setCurrentQ((value) => value + 1);
    setSelected(null);
    setShowExplanation(false);
  };

  const resetQuiz = () => {
    setState("select");
    setPlayMode("chapter");
    setSelectedSubject(null);
    setSelectedChapter("");
    setActiveGrade("General");
    setQuestions([]);
    setCurrentQ(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setTimeLeft(null);
    setStartedAt(null);
    setFinishedDuration(0);
  };

  const scorePercent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const quizProgress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0;
  const formattedTimeLeft = timeLeft === null ? null : `${Math.floor(timeLeft / 60).toString().padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`;
  const durationLabel = `${Math.floor(finishedDuration / 60)}m ${finishedDuration % 60}s`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {state === "select" && (
            <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <section className="mb-8 overflow-hidden rounded-[calc(var(--radius)+0.5rem)] border bg-card shadow-[var(--shadow-card)]">
                <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.4fr_0.9fr] md:px-8">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 font-heading text-xs font-semibold text-secondary-foreground">
                      <Sparkles className="h-3.5 w-3.5" />
                      Practice smarter across all subjects
                    </div>
                    <h1 className="max-w-2xl text-balance font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                      Quiz Time for every chapter that matters.
                    </h1>
                    <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-muted-foreground md:text-lg">
                      Pick a subject, start a chapter, or take a timed mock test for real exam-style practice.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                    {[
                      { icon: Brain, label: "Subjects", value: quizSummary.totalSubjects },
                      { icon: Layers3, label: "Chapters", value: quizSummary.totalChapters },
                      { icon: Trophy, label: "Questions", value: quizSummary.totalQuestions },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border bg-background/70 p-4 shadow-[var(--shadow-card)]">
                        <item.icon className="mb-3 h-5 w-5 text-primary" />
                        <div className="font-heading text-2xl font-bold text-foreground">{item.value}</div>
                        <div className="font-heading text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="mb-8 rounded-[calc(var(--radius)+0.25rem)] border bg-card p-6 shadow-[var(--shadow-card)]">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">Mock tests for real exam practice</h2>
                    <p className="mt-2 max-w-2xl font-body text-sm text-muted-foreground">Start a timed all-subject test, get instant scoring, and feed your dashboard with stronger insights.</p>
                  </div>
                  <div className="hidden rounded-full bg-secondary px-3 py-1.5 font-heading text-xs font-semibold text-secondary-foreground md:inline-flex">
                    Timed • Mixed • Saved locally
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {MOCK_TEST_CONFIGS.map((config) => (
                    <button
                      key={config.label}
                      onClick={() => startMockTest(config)}
                      className="rounded-2xl border bg-background p-5 text-left shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">{config.grade} class</div>
                          <h3 className="font-heading text-lg font-bold text-foreground">{config.label}</h3>
                          <p className="mt-2 font-body text-sm text-muted-foreground">{config.questionCount} mixed questions across {config.subjects.length} subjects.</p>
                        </div>
                        <FlaskConical className="h-5 w-5 text-primary" />
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-4 font-heading text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {config.durationMinutes} min</span>
                        <span>{config.subjects.join(" • ")}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {QUIZZES.map((quiz) => (
                  <motion.div
                    key={quiz.subject}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    viewport={{ once: true, amount: 0.15 }}
                    className="rounded-[calc(var(--radius)+0.25rem)] border bg-card p-5 shadow-[var(--shadow-card)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-heading text-xl font-bold text-foreground">{quiz.subject}</h2>
                        <p className="mt-1 font-body text-sm text-muted-foreground">
                          {quiz.chapters.length} chapters • {quiz.chapters.reduce((sum, chapter) => sum + chapter.questions.length, 0)} questions
                        </p>
                      </div>
                      <div className="rounded-full bg-secondary px-3 py-1 font-heading text-xs font-semibold text-secondary-foreground">Practice set</div>
                    </div>

                    <div className="space-y-2">
                      {quiz.chapters.map((chapter) => (
                        <button
                          key={chapter.name}
                          onClick={() => startQuiz(quiz, chapter.name)}
                          className="flex w-full items-center justify-between rounded-xl border border-border/70 bg-background px-3 py-3 font-heading text-sm font-medium text-foreground transition-[background-color,color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-[var(--shadow-soft)]"
                        >
                          <span className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            {chapter.name}
                          </span>
                          <span className="text-xs text-muted-foreground">{chapter.questions.length} Qs</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {state === "playing" && questions[currentQ] && (
            <motion.div key="playing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mb-6 flex flex-col gap-4 rounded-[calc(var(--radius)+0.25rem)] border bg-card p-5 shadow-[var(--shadow-card)] md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="font-heading text-sm text-muted-foreground">
                    {playMode === "mock" ? `${activeGrade} Class Mock Test` : `${selectedSubject?.subject} › ${selectedChapter}`}
                  </span>
                  <h2 className="font-heading text-lg font-bold text-foreground">Question {currentQ + 1} of {questions.length}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {formattedTimeLeft ? (
                    <span className="rounded-full bg-secondary px-3 py-1 font-heading text-sm font-semibold text-secondary-foreground">⏱ {formattedTimeLeft}</span>
                  ) : null}
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-heading text-sm font-semibold text-primary">Score: {score}/{currentQ + (selected !== null ? 1 : 0)}</span>
                </div>
              </div>

              <div className="mb-6 rounded-[calc(var(--radius)+0.1rem)] border bg-card p-4 shadow-[var(--shadow-card)]">
                <div className="mb-2 flex items-center justify-between font-heading text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round(quizProgress)}%</span>
                </div>
                <Progress value={quizProgress} className="h-2.5" />
              </div>

              <div className="rounded-[calc(var(--radius)+0.25rem)] border bg-card p-6 shadow-[var(--shadow-card)]">
                <p className="mb-6 font-body text-lg font-medium text-foreground">{questions[currentQ].question}</p>

                <div className="space-y-3">
                  {questions[currentQ].options.map((option, index) => {
                    const isSelected = selected === index;
                    const isCorrect = index === questions[currentQ].correct;
                    let optionClass = "border bg-background hover:bg-secondary/50";
                    if (selected !== null) {
                      if (isCorrect) optionClass = "border-accent bg-accent/10 text-accent-foreground";
                      else if (isSelected && !isCorrect) optionClass = "border-destructive bg-destructive/10 text-destructive";
                      else optionClass = "border bg-muted/50 opacity-60";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={selected !== null}
                        className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 font-heading text-sm font-medium transition-all ${optionClass}`}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold">{String.fromCharCode(65 + index)}</span>
                        <span className="text-left">{option}</span>
                        {selected !== null && isCorrect && <CheckCircle2 className="ml-auto h-5 w-5 text-accent" />}
                        {isSelected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-destructive" />}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 rounded-xl bg-secondary/50 p-4">
                      <p className="font-heading text-xs font-semibold text-secondary-foreground">💡 Explanation</p>
                      <p className="mt-1 font-body text-sm text-foreground">{questions[currentQ].explanation}</p>
                      {playMode === "mock" ? (
                        <p className="mt-2 font-heading text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{questions[currentQ].subject} • {questions[currentQ].chapter}</p>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>

                {selected !== null && (
                  <div className="mt-4 flex justify-end">
                    <Button onClick={nextQuestion} className="gap-2 font-heading">
                      {currentQ + 1 >= questions.length ? "See Results" : "Next Question"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {state === "result" && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="mx-auto max-w-2xl rounded-[calc(var(--radius)+0.5rem)] border bg-card p-8 shadow-[var(--shadow-card)]">
                <Trophy className={`mx-auto mb-4 h-16 w-16 ${scorePercent >= 80 ? "text-accent" : scorePercent >= 50 ? "text-primary" : "text-destructive"}`} />
                <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">
                  {scorePercent >= 80 ? "Excellent! 🎉" : scorePercent >= 50 ? "Good effort! 👍" : "Keep practicing! 💪"}
                </h2>
                <p className="mb-4 font-body text-muted-foreground">{playMode === "mock" ? `${activeGrade} Class Mock Test` : `${selectedSubject?.subject} › ${selectedChapter}`}</p>
                <div className="mb-6 text-5xl font-heading font-extrabold text-primary">{score}/{questions.length}</div>
                <p className="mb-6 font-heading text-sm text-muted-foreground">{scorePercent}% correct</p>

                <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full bg-secondary px-3 py-1 font-heading text-xs text-secondary-foreground">Mode: {playMode === "mock" ? "Mock Test" : "Chapter Quiz"}</span>
                  <span className="rounded-full bg-secondary px-3 py-1 font-heading text-xs text-secondary-foreground">Duration: {durationLabel}</span>
                </div>

                <div className="mb-6 rounded-2xl border bg-background/60 p-4">
                  <div className="mb-3 flex items-center justify-between font-heading text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <span>Accuracy</span>
                    <span>{scorePercent}%</span>
                  </div>
                  <Progress value={scorePercent} className="h-2.5" />
                </div>

                <div className="mb-6 space-y-2">
                  {questions.map((question, index) => (
                    <div key={`${question.question}-${index}`} className="flex items-center gap-2 rounded-lg bg-background px-3 py-2 text-left text-xs">
                      {answers[index] === question.correct ? <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" /> : <XCircle className="h-4 w-4 shrink-0 text-destructive" />}
                      <span className="truncate font-heading text-foreground">{question.question}</span>
                      {playMode === "mock" ? <span className="ml-auto shrink-0 font-heading text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{question.subject}</span> : null}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={() => playMode === "mock" ? startMockTest(MOCK_TEST_CONFIGS.find((item) => item.label === selectedChapter) || MOCK_TEST_CONFIGS[0]) : selectedSubject && startQuiz(selectedSubject, selectedChapter)} className="gap-2 font-heading">
                    <RotateCcw className="h-4 w-4" /> Retry
                  </Button>
                  <Button onClick={resetQuiz} className="gap-2 font-heading">
                    <BookOpen className="h-4 w-4" /> More Quizzes
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;