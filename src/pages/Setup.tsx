
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import CourseSetup from "../components/CourseSetup";
import PlayerSetup from "../components/PlayerSetup";
import GameSetupComponent from "../components/GameSetup";
import { useGame } from "../contexts/GameContext";
import { ArrowRight, CheckCircle } from "lucide-react";
import { GameSetup, PlayerHandicap } from "../utils/types";

const Setup = () => {
  const navigate = useNavigate();
  const { state, setupNewRound } = useGame();
  
  const [step, setStep] = useState(1);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [players, setPlayers] = useState<PlayerHandicap[]>([]);
  const [games, setGames] = useState<GameSetup[]>([]);
  
  const selectedCourse = state.courses.find(c => c.id === selectedCourseId);
  
  const handleAddPlayer = (player: PlayerHandicap) => {
    setPlayers(prev => [...prev, player]);
  };
  
  const handleRemovePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };
  
  const handleAddGame = (game: GameSetup) => {
    setGames(prev => [...prev, game]);
  };
  
  const handleRemoveGame = (gameId: string) => {
    setGames(prev => prev.filter(g => g.id !== gameId));
  };
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Start the round
      setupNewRound(selectedCourseId, players, games);
      navigate("/round");
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const isStepComplete = () => {
    switch (step) {
      case 1:
        return !!selectedCourseId;
      case 2:
        return players.length > 0;
      case 3:
        return games.length > 0;
      default:
        return false;
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="heading-2">Set Up New Round</h2>
          
          <div className="flex items-center space-x-2">
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
              step >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}>
              {step > 1 ? <CheckCircle size={16} /> : "1"}
            </div>
            <div className={`w-6 h-0.5 ${step > 1 ? "bg-primary" : "bg-secondary"}`}></div>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
              step >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}>
              {step > 2 ? <CheckCircle size={16} /> : "2"}
            </div>
            <div className={`w-6 h-0.5 ${step > 2 ? "bg-primary" : "bg-secondary"}`}></div>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
              step >= 3 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}>
              3
            </div>
          </div>
        </div>
        
        {step === 1 && (
          <CourseSetup 
            courses={state.courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
          />
        )}
        
        {step === 2 && selectedCourse && (
          <PlayerSetup 
            players={players}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
            tees={selectedCourse.tees}
          />
        )}
        
        {step === 3 && (
          <GameSetupComponent 
            players={players}
            games={games}
            onAddGame={handleAddGame}
            onRemoveGame={handleRemoveGame}
          />
        )}
        
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-6 py-2 rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors"
            >
              Back
            </button>
          ) : (
            <div></div> // Empty div to maintain flex layout
          )}
          
          <button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="px-6 py-2 rounded-lg font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center space-x-2"
          >
            <span>{step === 3 ? "Start Round" : "Next"}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Setup;
