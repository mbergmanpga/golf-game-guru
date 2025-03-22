
import React, { useState, useEffect } from "react";
import { 
  Course, 
  GameSetup, 
  HoleScore, 
  PlayerHandicap, 
  RoundData 
} from "../utils/types";
import { 
  calculateAdjustedHandicap, 
  calculateCourseHandicap, 
  calculateGamePoints, 
  calculateNetScore 
} from "../utils/gameLogic";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

interface ScoreCardProps {
  course: Course;
  currentHole: number;
  players: PlayerHandicap[];
  games: GameSetup[];
  scores: HoleScore[];
  onScoreSubmit: (scores: HoleScore[]) => void;
  onNavigateHole: (hole: number) => void;
  totalHoles: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  course,
  currentHole,
  players,
  games,
  scores,
  onScoreSubmit,
  onNavigateHole,
  totalHoles
}) => {
  const [playerScores, setPlayerScores] = useState<
    { playerId: string; grossScore: number }[]
  >([]);
  
  // Get the current hole's par and handicap
  const currentTee = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return course.tees[0];
    
    return course.tees.find(t => t.id === player.tee) || course.tees[0];
  };
  
  const getHolePar = (playerId: string) => {
    const tee = currentTee(playerId);
    return tee.pars[currentHole - 1] || 4; // Default to 4 if not found
  };
  
  const getHoleHandicap = (playerId: string) => {
    const tee = currentTee(playerId);
    return tee.handicaps[currentHole - 1] || 1; // Default to 1 if not found
  };
  
  // Initialize player scores when hole changes or players change
  useEffect(() => {
    const existingScores = scores.filter(s => s.hole === currentHole);
    
    const initialScores = players.map(player => {
      const existingScore = existingScores.find(s => s.playerId === player.id);
      return {
        playerId: player.id,
        grossScore: existingScore ? existingScore.grossScore : getHolePar(player.id)
      };
    });
    
    setPlayerScores(initialScores);
  }, [currentHole, players, scores]);
  
  const handleScoreChange = (playerId: string, grossScore: number) => {
    setPlayerScores(prev => 
      prev.map(score => 
        score.playerId === playerId ? { ...score, grossScore } : score
      )
    );
  };
  
  const handleSubmitScores = () => {
    // Calculate net scores and points for each player
    const calculatedScores: HoleScore[] = playerScores.map(playerScore => {
      const player = players.find(p => p.id === playerScore.playerId);
      if (!player) return {} as HoleScore;
      
      const tee = currentTee(player.id);
      const par = getHolePar(player.id);
      const holeHandicap = getHoleHandicap(player.id);
      
      // Calculate course handicap
      const courseHandicap = calculateCourseHandicap(
        player.handicapIndex,
        tee.slope,
        tee.rating,
        tee.pars.reduce((sum, par) => sum + par, 0)
      );
      
      // Calculate points for each game
      const points: Record<string, number> = {};
      
      // First calculate all net scores for all players to use in game calculations
      const allNetScores = playerScores.map(ps => {
        const p = players.find(pl => pl.id === ps.playerId);
        if (!p) return { playerId: ps.playerId, netScore: ps.grossScore };
        
        const t = currentTee(p.id);
        const courseHcp = calculateCourseHandicap(
          p.handicapIndex,
          t.slope,
          t.rating,
          t.pars.reduce((sum, par) => sum + par, 0)
        );
        
        const holeHcp = getHoleHandicap(p.id);
        return {
          playerId: ps.playerId,
          netScore: calculateNetScore(ps.grossScore, courseHcp, holeHcp, totalHoles)
        };
      });
      
      // For each game the player is in, calculate points
      games.forEach(game => {
        if (game.players.includes(player.id)) {
          // Adjust handicap based on game percentage
          const adjustedHandicap = calculateAdjustedHandicap(
            courseHandicap,
            game.handicapPercentage
          );
          
          // Calculate net score
          const netScore = calculateNetScore(
            playerScore.grossScore,
            adjustedHandicap,
            holeHandicap,
            totalHoles
          );
          
          // Create temporary score objects to use for game calculations
          const holeScores: HoleScore[] = allNetScores.filter(ns => 
            game.players.includes(ns.playerId)
          ).map(ns => ({
            playerId: ns.playerId,
            hole: currentHole,
            grossScore: playerScores.find(ps => ps.playerId === ns.playerId)?.grossScore || 0,
            netScore: ns.netScore
          }));
          
          // Calculate game-specific points
          const gamePoints = calculateGamePoints(
            game.type,
            holeScores,
            {
              id: "",
              date: new Date(),
              courseId: course.id,
              players,
              games: [game],
              currentHole,
              totalHoles
            },
            player.id,
            currentHole,
            par
          );
          
          points[game.id] = gamePoints;
        }
      });
      
      // Calculate the general net score for display (using 100% handicap)
      const netScore = calculateNetScore(
        playerScore.grossScore,
        courseHandicap,
        holeHandicap,
        totalHoles
      );
      
      return {
        playerId: player.id,
        hole: currentHole,
        grossScore: playerScore.grossScore,
        netScore,
        points
      };
    });
    
    onScoreSubmit(calculatedScores);
  };
  
  return (
    <div className="card">
      <div className="border-b border-border/40 p-4 flex items-center justify-between">
        <button
          onClick={() => onNavigateHole(currentHole - 1)}
          disabled={currentHole <= 1}
          className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="text-center">
          <div className="pill pill-primary mb-1">Hole {currentHole}</div>
          <div className="flex items-center justify-center space-x-6">
            {players.length > 0 && players.slice(0, 1).map(player => (
              <div key={player.id} className="text-sm">
                <span className="font-medium">Par</span>: {getHolePar(player.id)}
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => onNavigateHole(currentHole + 1)}
          disabled={currentHole >= totalHoles}
          className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {players.map((player) => {
            const playerScore = playerScores.find(score => score.playerId === player.id);
            const par = getHolePar(player.id);
            const scoreDiff = playerScore ? playerScore.grossScore - par : 0;
            let scoreClass = "text-foreground";
            
            if (scoreDiff < 0) scoreClass = "text-golf-darkGreen";
            else if (scoreDiff === 0) scoreClass = "text-golf-navy";
            else if (scoreDiff > 0) scoreClass = "text-destructive";
            
            return (
              <div key={player.id} className="border-b border-border/30 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{player.name}</h4>
                  <div className="text-sm text-foreground/70">
                    Handicap: {player.handicapIndex}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      if (playerScore && playerScore.grossScore > 1) {
                        handleScoreChange(player.id, playerScore.grossScore - 1);
                      }
                    }}
                    disabled={!playerScore || playerScore.grossScore <= 1}
                    className="p-2 rounded-l-lg border border-r-0 border-input bg-background hover:bg-secondary/50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    -
                  </button>
                  
                  <input
                    type="number"
                    min="1"
                    value={playerScore?.grossScore || par}
                    onChange={(e) => handleScoreChange(player.id, Number(e.target.value))}
                    className="w-16 text-center py-2 border-y border-input bg-background focus:outline-none text-lg font-medium"
                  />
                  
                  <button
                    onClick={() => {
                      if (playerScore) {
                        handleScoreChange(player.id, playerScore.grossScore + 1);
                      }
                    }}
                    className="p-2 rounded-r-lg border border-l-0 border-input bg-background hover:bg-secondary/50 transition-colors"
                  >
                    +
                  </button>
                  
                  <div className={`ml-4 text-lg font-medium ${scoreClass}`}>
                    {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff === 0 ? "E" : scoreDiff}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="border-t border-border/40 p-4">
        <button
          onClick={handleSubmitScores}
          className="w-full py-3 rounded-lg font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
        >
          <Save size={18} />
          <span>Save Scores</span>
        </button>
      </div>
    </div>
  );
};

export default ScoreCard;
