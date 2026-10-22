import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type UserRole = "student" | "teacher" | "admin";

interface AuthContext {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: UserRole;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthContext>({
  user: null,
  session: null,
  loading: true,
  role: "student",
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>("student");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        setTimeout(() => fetchRole(session.user.id), 0);
      } else {
        setRole("student");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) fetchRole(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    if (data?.role) setRole(data.role as UserRole);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthCtx.Provider value={{ user, session, loading, role, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}
