import { BookOpen, MessageCircle, Trophy, Bookmark, BarChart3, FileText, GraduationCap, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/chat", label: "Chat", icon: MessageCircle },
    { to: "/quiz", label: "Quiz", icon: Trophy },
    { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { to: "/study-notes", label: "Notes", icon: FileText },
    { to: "/documents", label: "Documents", icon: FileText },
    { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
    ...(role === "teacher" || role === "admin" ? [{ to: "/teacher", label: "Teacher", icon: GraduationCap }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex min-h-16 flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-[var(--shadow-soft)]">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <span className="block font-heading text-lg font-bold leading-none text-foreground">VidyaSathi</span>
            <span className="hidden font-heading text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">Rural Tutor AI</span>
          </div>
        </Link>

        <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-end">
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-2xl border bg-card p-1 shadow-[var(--shadow-card)] md:flex-initial">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="shrink-0">
              <Button
                variant={path === link.to ? "default" : "ghost"}
                size="sm"
                className="gap-1.5 rounded-xl font-heading text-xs"
              >
                <link.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{link.label}</span>
              </Button>
              </Link>
            ))}
          </div>
          <ThemeToggle />{user ? <Link to="/profile"><Button size="sm" variant="ghost" className="font-heading text-xs">Profile</Button></Link> : null}{user ? <Button size="sm" variant="outline" onClick={() => signOut()} className="font-heading text-xs">Sign out</Button> : <Link to="/auth"><Button size="sm" className="font-heading text-xs">Sign in</Button></Link>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

