
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, Home, Flag, Menu } from "lucide-react";
import { useGame } from "../contexts/GameContext";

const Header: React.FC = () => {
  const location = useLocation();
  const { state, resetRound } = useGame();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHome = location.pathname === "/";
  const isRound = location.pathname.includes("/round");
  const isSetup = location.pathname.includes("/setup");
  const isResults = location.pathname.includes("/results");

  const getTitle = () => {
    if (isHome) return "Golf Game Guru";
    if (isSetup) return "Game Setup";
    if (isRound) {
      return state.currentRound 
        ? `Hole ${state.currentRound.currentHole}` 
        : "Round";
    }
    if (isResults) return "Game Results";
    return "Golf Game Guru";
  };

  const handleEndRound = () => {
    if (confirm("Are you sure you want to end the current round?")) {
      resetRound();
    }
  };

  return (
    <div>
      <header className="h-16 bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {!isHome && (
                <Link 
                  to={isRound ? "/results" : "/"} 
                  className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <ArrowLeft size={20} className="text-muted-foreground" />
                </Link>
              )}
              <h1 className="text-lg font-semibold">{getTitle()}</h1>
              {isRound && state.currentRound && (
                <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  {state.currentRound.currentHole}/{state.currentRound.totalHoles}
                </span>
              )}
            </div>

            <button 
              className="p-2 hover:bg-secondary rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="bg-background/95 backdrop-blur-sm border-t">
          <div className="max-w-4xl mx-auto px-4">
            <div className="py-3 space-y-1">
              <Link 
                to="/" 
                className="flex items-center gap-2 py-2 px-3 hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} className="text-foreground" />
                <span>Home</span>
              </Link>
              
              {(isRound || isResults) && (
                <button 
                  onClick={() => {
                    handleEndRound();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 py-2 px-3 hover:bg-destructive/10 rounded-lg transition-colors w-full text-left"
                >
                  <Flag size={18} className="text-destructive" />
                  <span className="text-destructive">End Round</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
