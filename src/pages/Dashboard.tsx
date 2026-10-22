import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Brain, Calendar, Clock, MessageSquare, Target, TrendingUp, Trophy, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getBookmarks } from "@/lib/bookmarks";
import { getChatSessions } from "@/lib/chatHistory";
import { getQuizAttempts } from "@/lib/quizAttempts";
import { addStudyTask, getStudyPlan, removeStudyTask, toggleStudyTask, type StudyTask } from "@/lib/studyPlanner";
import { useAuth } from "@/hooks/useAuth";

const SUBJECTS = ["Science", "Mathematics", "Physics", "Chemistry", "Biology", "Geography", "Social Science", "English", "Hindi", "Marathi"];
const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary-foreground))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--primary) / 0.7)",
  "hsl(var(--accent) / 0.7)",
  "hsl(var(--secondary-foreground) / 0.7)",
];

const Dashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyTask[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    (async () => { try { const [s,b,a,p,t] = await Promise.all([getChatSessions(), getBookmarks(), getQuizAttempts(), (await import("@/lib/db")).getProgress(), getStudyPlan()]); setSessions(s); setBookmarks(b); setAttempts(a); setProgress(p); setStudyPlan(t); } catch (e) { console.error(e); } finally { setLoadingData(false); } })();
  }, [user]);
  const [newTask, setNewTask] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState(SUBJECTS[0]);
  const [newTaskPriority, setNewTaskPriority] = useState<StudyTask["priority"]>("medium");
  const [newTaskDate, setNewTaskDate] = useState("");


  const subjectPerformance = useMemo(
    () => SUBJECTS.map((subject) => {
      const subjectProgress = progress.filter((item) => item.subject === subject);
      const chatCount = sessions.filter((session) => session.subject === subject).length;
      const average = subjectProgress.length > 0
        ? Math.round(subjectProgress.reduce((sum, item) => sum + (item.score || 0), 0) / subjectProgress.length)
        : 0;

      return { subject: subject.slice(0, 8), fullSubject: subject, score: average, chats: chatCount, attempts: subjectProgress.length };
    }).filter((item) => item.attempts > 0 || item.chats > 0),
    [progress, sessions],
  );

  const totalChats = sessions.length;
  const totalBookmarks = bookmarks.length;
  const completedTasks = studyPlan.filter((task) => task.done).length;
  const totalStudyTime = progress.reduce((sum, item) => sum + (item.study_time_minutes || 0), 0);
  const avgScore = progress.length > 0 ? Math.round(progress.reduce((sum, item) => sum + (item.score || 0), 0) / progress.length) : 0;
  const subjectsStudied = new Set(progress.map((item) => item.subject).filter(Boolean)).size;
  const completedMockTests = attempts.filter((attempt) => attempt.mode === "mock").length;
  const strongestSubject = subjectPerformance.reduce<{ fullSubject: string; score: number } | null>((best, current) => {
    if (!best || current.score > best.score) return { fullSubject: current.fullSubject, score: current.score };
    return best;
  }, null);

  const chatDistribution = SUBJECTS.map((subject, index) => ({
    name: subject,
    value: sessions.filter((session) => session.subject === subject).length,
    color: CHART_COLORS[index % CHART_COLORS.length],
  })).filter((item) => item.value > 0);

  const weakAreas = SUBJECTS.map((subject) => {
    const subjectProgress = progress.filter((item) => item.subject === subject);
    if (subjectProgress.length === 0) return null;
    const average = Math.round(subjectProgress.reduce((sum, item) => sum + (item.score || 0), 0) / subjectProgress.length);
    return average < 60 ? { subject, avg: average, attempts: subjectProgress.length } : null;
  }).filter(Boolean) as { subject: string; avg: number; attempts: number }[];

  const scoreTrend = progress.map((item) => ({
    date: new Date(item.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    score: item.score || 0,
  }));

  const studyStreak = useMemo(() => {
    const uniqueDays = Array.from(new Set(attempts.map((attempt) => new Date(attempt.createdAt).toDateString())));
    const sorted = uniqueDays.map((day) => new Date(day)).sort((a, b) => b.getTime() - a.getTime());
    if (sorted.length === 0) return 0;

    let streak = 1;
    for (let index = 1; index < sorted.length; index += 1) {
      const diffDays = Math.round((sorted[index - 1].getTime() - sorted[index].getTime()) / 86400000);
      if (diffDays === 1) streak += 1;
      else break;
    }
    return streak;
  }, [attempts]);

  const todayString = new Date().toISOString().slice(0, 10);
  const highPriorityTasks = studyPlan.filter((task) => !task.done && task.priority === "high").length;
  const todayTasks = studyPlan.filter((task) => !task.done && task.dueDate === todayString).length;
  const overdueTasks = studyPlan.filter((task) => !task.done && task.dueDate && task.dueDate < todayString).length;

  const refreshPlan = async () => setStudyPlan(await getStudyPlan());
  const handleAddTask = async () => { if (!newTask.trim()) return; await addStudyTask(newTask.trim(), newTaskSubject, newTaskPriority, newTaskDate || undefined); setNewTask(""); setNewTaskPriority("medium"); setNewTaskDate(""); await refreshPlan(); };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">📊 Your Dashboard</h1>
        <p className="mb-8 font-body text-muted-foreground">Track mock tests, study plans, bookmarks, and your strongest and weakest subjects.</p>{loadingData && <p className="mb-4 text-sm text-muted-foreground">Loading your saved data…</p>}

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">
          {[
            { icon: MessageSquare, label: "Chats", value: totalChats, color: "text-primary" },
            { icon: BookOpen, label: "Subjects", value: subjectsStudied, color: "text-accent" },
            { icon: Trophy, label: "Bookmarks", value: totalBookmarks, color: "text-primary" },
            { icon: Target, label: "Tasks Done", value: `${completedTasks}/${studyPlan.length}`, color: "text-accent" },
            { icon: Clock, label: "Study Mins", value: totalStudyTime, color: "text-primary" },
            { icon: Award, label: "Avg Score", value: `${avgScore}%`, color: "text-accent" },
            { icon: Zap, label: "Mock Tests", value: completedMockTests, color: "text-primary" },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-3 text-center shadow-[var(--shadow-card)]">
              <stat.icon className={`mx-auto mb-1.5 h-5 w-5 ${stat.color}`} />
              <div className="font-heading text-xl font-bold text-foreground">{stat.value}</div>
              <div className="font-heading text-[10px] text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="font-heading text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Study Streak</p>
            <div className="mt-2 font-heading text-3xl font-bold text-foreground">{studyStreak} day{studyStreak === 1 ? "" : "s"}</div>
            <p className="mt-2 font-body text-sm text-muted-foreground">Keep taking quizzes daily to build momentum.</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="font-heading text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Best Subject</p>
            <div className="mt-2 font-heading text-2xl font-bold text-foreground">{strongestSubject?.fullSubject || "Start practicing"}</div>
            <p className="mt-2 font-body text-sm text-muted-foreground">{strongestSubject ? `${strongestSubject.score}% average so far.` : "Solve a quiz to unlock insights."}</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="font-heading text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Planner Focus</p>
            <div className="mt-2 space-y-2 font-body text-sm text-foreground">
              <p>{highPriorityTasks} high-priority tasks pending</p>
              <p>{todayTasks} tasks due today</p>
              <p>{overdueTasks} overdue tasks</p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-base font-bold text-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              Subject Performance
            </h2>
            {subjectPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={subjectPerformance} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fontFamily: "Outfit" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontFamily: "Outfit", fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Avg Score %" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center font-heading text-xs text-muted-foreground">Take quizzes to see your performance.</p>
            )}
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-base font-bold text-foreground">
              <MessageSquare className="h-4 w-4 text-accent" />
              Chat Distribution
            </h2>
            {chatDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={chatDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false} style={{ fontSize: 10, fontFamily: "Outfit" }}>
                    {chatDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontFamily: "Outfit", fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center font-heading text-xs text-muted-foreground">Start chatting to see subject distribution.</p>
            )}
          </div>
        </div>

        {scoreTrend.length > 1 && (
          <div className="mb-8 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-base font-bold text-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              Score Trend
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={scoreTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "Outfit" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontFamily: "Outfit", fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {weakAreas.length > 0 && (
          <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-foreground">
              <Brain className="h-4 w-4 text-destructive" />
              Weak Areas — Focus Here
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {weakAreas.map((area) => (
                <div key={area.subject} className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
                  <span className="font-heading text-sm text-foreground">{area.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xs font-semibold text-destructive">{area.avg}%</span>
                    <span className="font-heading text-[10px] text-muted-foreground">({area.attempts} attempts)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-base font-bold text-foreground">
            <Brain className="h-4 w-4 text-primary" />
            Smart Recommendations
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border bg-background p-4">
              <p className="font-heading text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Next best action</p>
              <p className="mt-2 font-body text-sm text-foreground">{weakAreas[0] ? `Retry ${weakAreas[0].subject} with a fresh mock test.` : "Take a mock test to unlock personalized recommendations."}</p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <p className="font-heading text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Revision hub</p>
              <p className="mt-2 font-body text-sm text-foreground">{totalBookmarks > 0 ? `You have ${totalBookmarks} saved explanations ready for revision.` : "Bookmark chat answers to build your revision stack."}</p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <p className="font-heading text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Planner tip</p>
              <p className="mt-2 font-body text-sm text-foreground">{highPriorityTasks > 0 ? `Finish ${highPriorityTasks} high-priority tasks first.` : "Add one high-priority task for your toughest subject."}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-base font-bold text-foreground">
            <Calendar className="h-4 w-4 text-accent" />
            Study Planner
          </h2>
          <div className="mb-4 grid gap-2 md:grid-cols-[1fr_1fr_140px_140px_auto]">
            <select value={newTaskSubject} onChange={(e) => setNewTaskSubject(e.target.value)} className="rounded-lg border bg-background px-3 py-2 font-heading text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <input value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddTask()} placeholder="Add a study task..." className="rounded-lg border bg-background px-3 py-2 font-heading text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value as StudyTask["priority"])} className="rounded-lg border bg-background px-3 py-2 font-heading text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="high">High priority</option>
              <option value="medium">Medium priority</option>
              <option value="low">Low priority</option>
            </select>
            <input type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} className="rounded-lg border bg-background px-3 py-2 font-heading text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <Button onClick={handleAddTask} className="font-heading text-sm">Add</Button>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {[`${highPriorityTasks} high-priority`, `${todayTasks} due today`, `${overdueTasks} overdue`].map((item) => (
              <span key={item} className="rounded-full bg-secondary px-3 py-1 font-heading text-[10px] uppercase tracking-[0.14em] text-secondary-foreground">{item}</span>
            ))}
          </div>

          {studyPlan.length === 0 ? (
            <p className="py-6 text-center font-heading text-sm text-muted-foreground">No study tasks yet. Add one above.</p>
          ) : (
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {studyPlan.map((task) => (
                <div key={task.id} className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-all ${task.done ? "bg-muted/50 opacity-60" : "bg-background"}`}>
                  <button onClick={() => { toggleStudyTask(task.id, task.done).then(refreshPlan) }} className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${task.done ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-primary"}`}>
                    {task.done && <span className="text-xs">✓</span>}
                  </button>
                  <div className="flex-1">
                    <p className={`font-heading text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.text}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="rounded-full bg-secondary px-2 py-0.5 font-heading text-[10px] text-secondary-foreground">{task.subject}</span>
                      <span className={`rounded-full px-2 py-0.5 font-heading text-[10px] ${task.priority === "high" ? "bg-destructive/10 text-destructive" : task.priority === "low" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>{task.priority}</span>
                      {task.dueDate ? <span className="rounded-full bg-muted px-2 py-0.5 font-heading text-[10px] text-muted-foreground">Due {task.dueDate}</span> : null}
                    </div>
                  </div>
                  <button onClick={() => { removeStudyTask(task.id).then(refreshPlan) }} className="text-xs text-muted-foreground hover:text-destructive">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;