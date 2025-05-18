
import { Toaster } from "@/components/UI/toaster";
import { Toaster as Sonner } from "@/components/UI/sonner";
import { TooltipProvider } from "@/components/UI/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TodoPage from "./pages/TodoPage";
import PomodoroPage from "./pages/PomodoroPage";
import JournalPage from "./pages/JournalPage";
import HabitPage from "./pages/HabitPage";
// import Layout from "./components/ui/Layout";
import Layout from "@/components/UI/Layout"; // ✅ correct casing for both folder and file

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/pomodoro" element={<PomodoroPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/habits" element={<HabitPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
