
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./contexts/GameContext";
import Index from "./pages/Index";
import Setup from "./pages/Setup";
import Round from "./pages/Round";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <GameProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/round" element={<Round />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </GameProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
