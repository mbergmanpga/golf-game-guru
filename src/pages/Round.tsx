
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ScoreCard from "../components/ScoreCard";
import { useGame } from "../contexts/GameContext";
import { HoleScore } from "../utils/types";
import { List, BarChart } from "lucide-react";
import { BingoBangoBongoSelector } from "../components/BingoBangoBongoSelector";

const Round = () => {
  const navigate = useNavigate();
  const { state, recordScore, navigateToHole } = useGame();
  const [showBBBSelector, setShowBBBSelector] = useState(false);
  const [currentScores, setCurrentScores] = useState<HoleScore[]>([]);
  
  useEffect(() => {
    // Redirect to setup if no current round
    if (!state.currentRound) {
      navigate("/setup");
    }
  }, [state.currentRound, navigate]);
  
  if (!state.currentRound || !state.roundData) {
    return null; // Will redirect via useEffect
  }
  
  const selectedCourse = state.courses.find(c => c.id === state.currentRound.courseId);
  if (!selectedCourse) {
    return null;
  }
  
  // Check if BBB game is active
  const hasBBBGame = state.currentRound.games.some(game => game.type === "bingoBangoBongo");
  
  const handleScoreSubmit = (scores: HoleScore[]) => {
    // If there's a BBB game, show the selector before proceeding
    if (hasBBBGame) {
      setCurrentScores(scores);
      setShowBBBSelector(true);
    } else {
      // No BBB game, proceed normally
      submitScores(scores);
    }
  };
  
  const submitScores = (scores: HoleScore[]) => {
    // Record each score
    scores.forEach(score => {
      recordScore(
        score.playerId,
        score.hole,
        score.grossScore,
        score.netScore,
        score.points
      );
    });
    
    // If it's the last hole, navigate to results
    if (state.currentRound.currentHole >= state.currentRound.totalHoles) {
      navigate("/results");
    } else {
      // Otherwise move to the next hole
      navigateToHole(state.currentRound.currentHole + 1);
    }
  };
  
  const handleBBBComplete = (scores: HoleScore[]) => {
    setShowBBBSelector(false);
    submitScores(scores);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="heading-2">{selectedCourse.name}</h2>
            
            <div className="flex space-x-2">
              <button
                onClick={() => navigate("/results")}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/70 transition-colors"
                title="View Leaderboard"
              >
                <BarChart size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {state.currentRound.games.map(game => {
              const gameTitle = {
                bingoBangoBongo: "Bingo Bango Bongo",
                wolf: "Wolf",
                fourBall: "Four Ball",
                stroke: "Stroke Play"
              }[game.type];
              
              return (
                <div key={game.id} className="pill pill-secondary">
                  {gameTitle}
                </div>
              );
            })}
          </div>
        </div>
        
        {showBBBSelector ? (
          <BingoBangoBongoSelector
            players={state.currentRound.players}
            currentHole={state.currentRound.currentHole}
            scores={currentScores}
            onComplete={handleBBBComplete}
            onCancel={() => setShowBBBSelector(false)}
          />
        ) : (
          <ScoreCard 
            course={selectedCourse}
            currentHole={state.currentRound.currentHole}
            players={state.currentRound.players}
            games={state.currentRound.games}
            scores={state.roundData.scores}
            onScoreSubmit={handleScoreSubmit}
            onNavigateHole={navigateToHole}
            totalHoles={state.currentRound.totalHoles}
          />
        )}
        
        <div className="fixed bottom-0 left-0 right-0 glass-morphism border-t border-border/40 py-2">
          <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
            <div className="flex justify-center">
              {Array.from({ length: Math.min(9, state.currentRound.totalHoles) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => navigateToHole(i + 1)}
                  className={`w-8 h-8 mx-0.5 rounded-full flex items-center justify-center text-sm ${
                    state.currentRound && state.currentRound.currentHole === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                  } transition-colors`}
                >
                  {i + 1}
                </button>
              ))}
              
              {state.currentRound.totalHoles > 9 && (
                <button className="w-8 h-8 mx-0.5 rounded-full flex items-center justify-center text-sm bg-secondary text-secondary-foreground hover:bg-secondary/70 transition-colors">
                  <List size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Round;
