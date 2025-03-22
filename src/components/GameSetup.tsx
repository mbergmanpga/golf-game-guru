
import React, { useState } from "react";
import { GameSetup, GameType, PlayerHandicap } from "../utils/types";
import { Plus, Trash2, Trophy, Clock, Users, ClipboardCheck } from "lucide-react";

interface GameSetupProps {
  players: PlayerHandicap[];
  games: GameSetup[];
  onAddGame: (game: GameSetup) => void;
  onRemoveGame: (gameId: string) => void;
}

const GAME_TYPE_OPTIONS: { value: GameType; label: string; icon: React.ElementType; description: string }[] = [
  { 
    value: "stroke", 
    label: "Stroke Play", 
    icon: ClipboardCheck,
    description: "Traditional golf scoring - lowest total strokes wins" 
  },
  { 
    value: "bingoBangoBongo", 
    label: "Bingo Bango Bongo", 
    icon: Trophy,
    description: "Points for first on green, closest to pin, and first in hole" 
  },
  { 
    value: "wolf", 
    label: "Wolf", 
    icon: Users,
    description: "Team-based game where the 'Wolf' rotates each hole" 
  },
  { 
    value: "fourBall", 
    label: "Four Ball", 
    icon: Clock,
    description: "2v2 team competition using best ball from each team" 
  }
];

const DEFAULT_HANDICAP_PERCENTAGES: Record<GameType, number> = {
  stroke: 100,
  bingoBangoBongo: 80,
  wolf: 90,
  fourBall: 90
};

const GameSetupComponent: React.FC<GameSetupProps> = ({
  players,
  games,
  onAddGame,
  onRemoveGame
}) => {
  const [gameType, setGameType] = useState<GameType>("stroke");
  const [handicapPercentage, setHandicapPercentage] = useState(DEFAULT_HANDICAP_PERCENTAGES[gameType]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const handleGameTypeChange = (type: GameType) => {
    setGameType(type);
    setHandicapPercentage(DEFAULT_HANDICAP_PERCENTAGES[type]);
  };

  const handlePlayerToggle = (playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleSelectAllPlayers = () => {
    if (selectedPlayers.length === players.length) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(players.map(p => p.id));
    }
  };

  const handleAddGame = () => {
    if (gameType && handicapPercentage >= 0 && selectedPlayers.length > 0) {
      const newGame: GameSetup = {
        id: `game-${Date.now()}`,
        type: gameType,
        handicapPercentage,
        players: selectedPlayers
      };
      
      onAddGame(newGame);
      
      // Reset form
      setGameType("stroke");
      setHandicapPercentage(DEFAULT_HANDICAP_PERCENTAGES.stroke);
      setSelectedPlayers([]);
    }
  };

  const GameTypeIcon = GAME_TYPE_OPTIONS.find(opt => opt.value === gameType)?.icon || Trophy;

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h3 className="heading-3 mb-4">Add Game Format</h3>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-3">
              Game Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GAME_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleGameTypeChange(option.value)}
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${
                    gameType === option.value 
                      ? "border-primary bg-primary/10" 
                      : "border-border bg-card hover:bg-secondary/50"
                  } transition-colors text-left`}
                >
                  <div className={`icon-container flex-shrink-0 ${gameType === option.value ? "bg-primary/20" : ""}`}>
                    <option.icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium">{option.label}</h4>
                    <p className="text-sm text-foreground/70">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="handicapPercentage" className="block text-sm font-medium text-foreground/70 mb-1">
              Handicap Percentage
            </label>
            <div className="flex items-center space-x-3">
              <input
                id="handicapPercentage"
                type="range"
                min="0"
                max="100"
                step="5"
                value={handicapPercentage}
                onChange={(e) => setHandicapPercentage(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-medium w-12 text-center">
                {handicapPercentage}%
              </span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-foreground/70">
                Select Players
              </label>
              <button
                type="button"
                onClick={handleSelectAllPlayers}
                className="text-sm text-primary hover:underline"
              >
                {selectedPlayers.length === players.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {players.length > 0 ? (
                players.map((player) => (
                  <div 
                    key={player.id}
                    onClick={() => handlePlayerToggle(player.id)}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                      selectedPlayers.includes(player.id) 
                        ? "border-primary bg-primary/10" 
                        : "border-border bg-card hover:bg-secondary/50"
                    } transition-colors`}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedPlayers.includes(player.id)}
                        onChange={() => {}} // Handled by div click
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="text-left">
                        <h4 className="font-medium">{player.name}</h4>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-2 text-muted-foreground">
                  No players added yet
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleAddGame}
            disabled={!gameType || handicapPercentage < 0 || selectedPlayers.length === 0}
            className="w-full md:w-auto px-4 py-2 rounded-lg font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Game</span>
          </button>
        </div>
      </div>
      
      {games.length > 0 && (
        <div className="card p-5">
          <h3 className="heading-3 mb-4">Selected Games ({games.length})</h3>
          
          <div className="space-y-3">
            {games.map((game) => {
              const gameTypeInfo = GAME_TYPE_OPTIONS.find(opt => opt.value === game.type);
              const GameIcon = gameTypeInfo?.icon || Trophy;
              const gamePlayers = players.filter(p => game.players.includes(p.id));
              
              return (
                <div 
                  key={game.id} 
                  className="flex items-start justify-between p-3 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-start space-x-3">
                    <div className="icon-container mt-0.5">
                      <GameIcon size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium">{gameTypeInfo?.label || game.type}</h4>
                      <div className="text-sm text-foreground/70">
                        <p>Handicap: {game.handicapPercentage}%</p>
                        <p className="line-clamp-1">
                          Players: {gamePlayers.map(p => p.name).join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onRemoveGame(game.id)}
                    className="p-2 rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSetupComponent;
