import { FormEvent, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const state = location.state as { mode?: "login" | "register" } | null;
    if (state?.mode) setMode(state.mode);
  }, [location.state]);

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true);
    try {
      if (mode === "register") {
        if (!fullName.trim()) throw new Error("Please enter your full name.");
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: fullName.trim() } } });
        if (error) throw error;
        if (data.session) { toast.success("Account created!"); navigate("/dashboard"); }
        else toast.success("Account created. Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (error) { toast.error(error instanceof Error ? error.message : "Authentication failed."); }
    finally { setBusy(false); }
  };

  return <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
    <div className="w-full max-w-md rounded-2xl border bg-card p-7 shadow-[var(--shadow-card)]">
      <div className="mb-7 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary"><BookOpen className="h-6 w-6 text-primary-foreground" /></div><h1 className="font-heading text-2xl font-bold">VidyaSathi</h1><p className="mt-1 text-sm text-muted-foreground">{mode === "login" ? "Sign in to continue learning" : "Create your student account"}</p></div>
      <form onSubmit={submit} className="space-y-4">
        {mode === "register" && <div className="space-y-2"><Label>Full name</Label><Input value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Your full name" /></div>}
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" /></div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Minimum 6 characters" /></div>
        <Button className="w-full" disabled={busy}>{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{mode === "login" ? "Sign In" : "Create Account"}</Button>
      </form>
      <div className="mt-5 text-center text-sm text-muted-foreground">{mode === "login" ? "New to VidyaSathi?" : "Already have an account?"} <button className="font-semibold text-primary hover:underline" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Create account" : "Sign in"}</button></div>
    </div>
  </div>;
}
