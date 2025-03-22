
import React, { useMemo } from "react";
import { GameSetup, HoleScore, PlayerHandicap, RoundData } from "../utils/types";
import { ArrowRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

interface GameResultsProps {
  games: GameSetup[];
  players: PlayerHandicap[];
  scores: HoleScore[];
  isComplete: boolean;
}

const GameResults: React.FC<GameResultsProps> = ({
  games,
  players,
  scores,
  isComplete
}) => {
  // Calculate the total points for each player for each game
  const gameResults = useMemo(() => {
    return games.map(game => {
      const gamePlayers = players.filter(p => game.players.includes(p.id));
      
      const playerPoints = gamePlayers.map(player => {
        const playerScores = scores.filter(score => score.playerId === player.id);
        let totalPoints = 0;
        
        playerScores.forEach(score => {
          if (score.points && score.points[game.id] !== undefined) {
            totalPoints += score.points[game.id];
          }
        });
        
        return {
          playerId: player.id,
          name: player.name,
          totalPoints
        };
      });
      
      // Sort by points (descending)
      playerPoints.sort((a, b) => b.totalPoints - a.totalPoints);
      
      return {
        gameId: game.id,
        gameType: game.type,
        playerPoints
      };
    });
  }, [games, players, scores]);
  
  // Calculate stroke play (gross and net) results
  const strokePlayResults = useMemo(() => {
    const strokeGame = games.find(game => game.type === "stroke");
    if (!strokeGame) return null;
    
    const gamePlayers = players.filter(p => strokeGame.players.includes(p.id));
    
    const playerScores = gamePlayers.map(player => {
      const playerHoleScores = scores.filter(score => score.playerId === player.id);
      
      const totalGrossScore = playerHoleScores.reduce(
        (sum, score) => sum + score.grossScore, 
        0
      );
      
      const totalNetScore = playerHoleScores.reduce(
        (sum, score) => sum + score.netScore, 
        0
      );
      
      return {
        playerId: player.id,
        name: player.name,
        grossScore: totalGrossScore,
        netScore: totalNetScore
      };
    });
    
    // Sort by net score (ascending)
    playerScores.sort((a, b) => a.netScore - b.netScore);
    
    return {
      gameId: strokeGame.id,
      playerScores
    };
  }, [games, players, scores]);
  
  return (
    <div className="space-y-6">
      {gameResults.map(result => {
        const game = games.find(g => g.id === result.gameId);
        if (!game) return null;
        
        // Skip stroke play here, we'll handle it separately
        if (game.type === "stroke") return null;
        
        const gameTitle = {
          bingoBangoBongo: "Bingo Bango Bongo",
          wolf: "Wolf",
          fourBall: "Four Ball",
          stroke: "Stroke Play"
        }[game.type];
        
        return (
          <div key={result.gameId} className="card p-5">
            <h3 className="heading-3 mb-4">{gameTitle} Results</h3>
            
            {result.playerPoints.length > 0 ? (
              <div className="space-y-3">
                {result.playerPoints.map((player, index) => (
                  <div 
                    key={player.playerId}
                    className={`flex items-center p-3 rounded-lg border ${
                      index === 0 ? "border-golf-sand bg-golf-sand/10" : "border-border bg-card"
                    }`}
                  >
                    <div className="text-center w-8 mr-3">
                      {index === 0 && (
                        <div className="icon-container bg-golf-sand/20 mx-auto">
                          <Trophy size={16} className="text-golf-sand" />
                        </div>
                      )}
                      {index > 0 && <span className="text-foreground/70">{index + 1}</span>}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{player.name}</h4>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-lg font-semibold">{player.totalPoints}</span>
                      <span className="text-sm text-foreground/70 ml-1">pts</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No scores recorded yet
              </div>
            )}
          </div>
        );
      })}
      
      {strokePlayResults && (
        <div className="card p-5">
          <h3 className="heading-3 mb-4">Stroke Play Results</h3>
          
          {strokePlayResults.playerScores.length > 0 ? (
            <div className="space-y-3">
              {strokePlayResults.playerScores.map((player, index) => (
                <div 
                  key={player.playerId}
                  className={`flex items-center p-3 rounded-lg border ${
                    index === 0 ? "border-golf-sand bg-golf-sand/10" : "border-border bg-card"
                  }`}
                >
                  <div className="text-center w-8 mr-3">
                    {index === 0 && (
                      <div className="icon-container bg-golf-sand/20 mx-auto">
                        <Trophy size={16} className="text-golf-sand" />
                      </div>
                    )}
                    {index > 0 && <span className="text-foreground/70">{index + 1}</span>}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{player.name}</h4>
                  </div>
                  
                  <div className="text-right">
                    <div>
                      <span className="font-semibold">{player.netScore}</span>
                      <span className="text-sm text-foreground/70 ml-1">net</span>
                    </div>
                    <div className="text-sm text-foreground/70">
                      {player.grossScore} gross
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No scores recorded yet
            </div>
          )}
        </div>
      )}
      
      {!isComplete && (
        <div className="mt-8">
          <Link 
            to="/round" 
            className="w-full py-3 rounded-lg font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Continue Round</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default GameResults;
