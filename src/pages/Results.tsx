
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import GameResults from "../components/GameResults";
import { useGame } from "../contexts/GameContext";

const Results = () => {
  const navigate = useNavigate();
  const { state } = useGame();
  
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
  
  // Check if all holes have been played
  const totalHoles = state.currentRound.totalHoles;
  const playedHolesSet = new Set(state.roundData.scores.map(score => score.hole));
  const isComplete = playedHolesSet.size === totalHoles;
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="heading-2 mb-1">{selectedCourse.name}</h2>
          <div className="text-foreground/70">
            {state.currentRound.players.length} players • {state.currentRound.games.length} games
          </div>
          
          {!isComplete && (
            <div className="mt-2 pill pill-primary">
              Hole {state.currentRound.currentHole}/{totalHoles}
            </div>
          )}
          
          {isComplete && (
            <div className="mt-2 pill pill-primary">
              Round Complete
            </div>
          )}
        </div>
        
        <GameResults 
          games={state.currentRound.games}
          players={state.currentRound.players}
          scores={state.roundData.scores}
          isComplete={isComplete}
        />
      </div>
    </Layout>
  );
};

export default Results;
