
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, Home, Golf, Menu } from "lucide-react";
import { useGame } from "../contexts/GameContext";

const Header: React.FC = () => {
  const location = useLocation();
  const { state, resetRound } = useGame();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
    <header className="sticky top-0 z-10 glass-morphism border-b border-border/40">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            {!isHome && (
              <Link 
                to={isRound ? "/results" : "/"} 
                className="p-2 -ml-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
            )}
            <h1 className="text-lg font-semibold">{getTitle()}</h1>
            {isRound && state.currentRound && (
              <div className="pill pill-primary">
                {state.currentRound.currentHole}/{state.currentRound.totalHoles}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <button 
              className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="glass-morphism border-t border-border/20 animate-slide-down">
          <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-3">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              
              {(isRound || isResults) && (
                <button 
                  onClick={() => {
                    handleEndRound();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 py-2 px-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-left"
                >
                  <Golf size={18} />
                  <span>End Round</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
