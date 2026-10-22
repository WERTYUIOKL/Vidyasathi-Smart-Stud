import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, BookOpen, Zap, Wifi, IndianRupee, GraduationCap, Trophy, BarChart3, NotebookPen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import heroImage from "@/assets/hero-illustration.jpg";

const features = [
  {
    icon: BookOpen,
    title: "Textbook-Aligned",
    description: "Answers directly from your state-board NCERT textbooks. Every response is curriculum-accurate.",
  },
  {
    icon: Zap,
    title: "Low-Cost Queries",
    description: "Optimized AI pipeline that minimizes API costs — making education affordable at scale.",
  },
  {
    icon: Wifi,
    title: "Works on Low Bandwidth",
    description: "Designed for spotty internet connections. Lightweight responses that load fast even on 2G.",
  },
  {
    icon: IndianRupee,
    title: "Free for Students",
    description: "No subscription fees. Quality education should never be locked behind a paywall.",
  },
  {
    icon: GraduationCap,
    title: "Personalized Learning",
    description: "Adapts to your learning pace. Get explanations in simple language that you understand.",
  },
  {
    icon: MessageCircle,
    title: "Ask Anything",
    description: "From Science to Maths, History to English — your AI tutor covers all subjects.",
  },
];

const quickActions = [
  {
    icon: MessageCircle,
    title: "Ask the tutor",
    description: "Start a textbook-based chat for quick doubt solving.",
    to: "/chat",
    cta: "Open Chat",
  },
  {
    icon: Trophy,
    title: "Take quizzes",
    description: "Practice chapter-wise questions with instant explanations.",
    to: "/quiz",
    cta: "Start Quiz",
  },
  {
    icon: BarChart3,
    title: "Track progress",
    description: "Review your study streak, bookmarks, and planner in one place.",
    to: "/dashboard",
    cta: "View Dashboard",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mb-4 inline-block rounded-full bg-secondary px-4 py-1.5 font-heading text-xs font-semibold text-secondary-foreground">
                🇮🇳 Built for Rural India
              </span>
              <h1 className="mb-6 max-w-2xl text-balance font-heading text-4xl font-extrabold leading-[1.02] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Rural-first learning that feels personal, fast, and local.
              </h1>
              <p className="mb-8 max-w-lg font-body text-lg leading-relaxed text-muted-foreground">
                VidyaSathi helps students ask textbook questions, revise chapter-wise, and build confidence with simple explanations that work even on slow internet.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/chat">
                  <Button size="lg" className="gap-2 font-heading text-base shadow-[var(--shadow-soft)]">
                    <MessageCircle className="h-5 w-5" />
                    Start Learning Free
                  </Button>
                </Link>
                <Link to="/quiz">
                  <Button size="lg" variant="outline" className="gap-2 font-heading text-base">
                    <Trophy className="h-5 w-5" />
                    Practice Quiz
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                {[
                  { label: "Subjects", value: "8+" },
                  { label: "Quiz Chapters", value: "20+" },
                  { label: "Study Modes", value: "Chat • Notes • Quiz" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border bg-background/70 px-4 py-3 shadow-[var(--shadow-card)]">
                    <div className="font-heading text-lg font-bold text-foreground">{item.value}</div>
                    <div className="font-heading text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="overflow-hidden rounded-[2rem] border bg-card p-3 shadow-[var(--shadow-soft)]">
                <img
                  src={heroImage}
                  alt="Indian students studying with technology"
                  className="w-full rounded-[1.5rem]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Education Without Barriers
            </h2>
            <p className="mx-auto max-w-xl font-body text-muted-foreground">
              Designed ground-up for the constraints of rural India — low bandwidth, low cost, high impact.
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-card/50 py-18 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-10 max-w-2xl"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">What you can do today</h2>
            <p className="mt-3 font-body text-muted-foreground">
              Jump straight into the three flows students use most: ask, practice, and review.
            </p>
          </motion.div>

          <div className="grid gap-5 lg:grid-cols-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-[calc(var(--radius)+0.35rem)] border bg-background p-6 shadow-[var(--shadow-card)]"
              >
                <action.icon className="mb-4 h-6 w-6 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">{action.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{action.description}</p>
                <Link to={action.to} className="mt-6 inline-flex">
                  <Button variant="ghost" className="gap-2 px-0 font-heading text-primary hover:bg-transparent hover:text-primary">
                    {action.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.25 }}
            className="mx-auto max-w-4xl rounded-[2rem] border bg-card px-6 py-10 shadow-[var(--shadow-card)] md:px-10"
          >
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 font-heading text-xs font-semibold text-secondary-foreground">
              <NotebookPen className="h-3.5 w-3.5" />
              No signup needed
            </div>
            <h2 className="mb-4 font-heading text-2xl font-bold text-foreground md:text-4xl">
              Open the tutor, ask a doubt, and keep moving.
            </h2>
            <p className="mx-auto mb-8 max-w-2xl font-body text-muted-foreground">
              Built for students who need quick answers, clear revision, and steady progress without friction.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/chat">
                <Button size="lg" className="gap-2 font-heading shadow-[var(--shadow-soft)]">
                  <MessageCircle className="h-5 w-5" />
                  Open VidyaSathi
                </Button>
              </Link>
              <Link to="/study-notes">
                <Button size="lg" variant="outline" className="gap-2 font-heading">
                  <BookOpen className="h-5 w-5" />
                  Study Notes
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center font-heading text-sm text-muted-foreground">
          VidyaSathi — Empowering education across India 🇮🇳
        </div>
      </footer>
    </div>
  );
};

export default Index;
