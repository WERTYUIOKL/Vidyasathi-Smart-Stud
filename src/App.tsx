import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Quiz from "./pages/Quiz";
import Bookmarks from "./pages/Bookmarks";
import Dashboard from "./pages/Dashboard";
import TextbookViewer from "./pages/TextbookViewer";
import StudyNotes from "./pages/StudyNotes";
import TeacherPanel from "./pages/TeacherPanel";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "@/hooks/useAuth";
import Documents from "./pages/Documents";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route element={<ProtectedRoute />}><Route path="/chat" element={<Chat />} /><Route path="/quiz" element={<Quiz />} /><Route path="/bookmarks" element={<Bookmarks />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/study-notes" element={<StudyNotes />} /><Route path="/documents" element={<Documents />} /><Route path="/profile" element={<Profile />} /><Route path="/textbook" element={<TextbookViewer />} /></Route>
      <Route element={<ProtectedRoute roles={["teacher", "admin"]} />}><Route path="/teacher" element={<TeacherPanel />} /></Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

