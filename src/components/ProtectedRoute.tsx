import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ roles }: { roles?: Array<"student" | "teacher" | "admin"> }) {
  const { user, loading, role } = useAuth();
  const location = useLocation();
  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
