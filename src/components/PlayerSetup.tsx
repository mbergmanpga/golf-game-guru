
import React, { useState } from "react";
import { PlayerHandicap } from "../utils/types";
import { Plus, Trash2, User } from "lucide-react";

interface PlayerSetupProps {
  players: PlayerHandicap[];
  onAddPlayer: (player: PlayerHandicap) => void;
  onRemovePlayer: (playerId: string) => void;
  tees: { id: string; name: string }[];
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({
  players,
  onAddPlayer,
  onRemovePlayer,
  tees
}) => {
  const [name, setName] = useState("");
  const [handicapIndex, setHandicapIndex] = useState<number | "">("");
  const [tee, setTee] = useState(tees.length > 0 ? tees[0].id : "");

  const handleAddPlayer = () => {
    if (name.trim() && handicapIndex !== "" && tee) {
      const newPlayer: PlayerHandicap = {
        id: `player-${Date.now()}`,
        name: name.trim(),
        handicapIndex: typeof handicapIndex === "number" ? handicapIndex : 0,
        tee
      };
      
      onAddPlayer(newPlayer);
      
      // Reset form
      setName("");
      setHandicapIndex("");
      setTee(tees.length > 0 ? tees[0].id : "");
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h3 className="heading-3 mb-4">Add Players</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-foreground/70 mb-1">
                Player Name
              </label>
              <input
                id="playerName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter player name"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-1 focus:ring-ring transition-all"
              />
            </div>
            
            <div>
              <label htmlFor="handicapIndex" className="block text-sm font-medium text-foreground/70 mb-1">
                Handicap Index
              </label>
              <input
                id="handicapIndex"
                type="number"
                value={handicapIndex}
                onChange={(e) => setHandicapIndex(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Enter handicap"
                min="0"
                max="54"
                step="0.1"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-1 focus:ring-ring transition-all"
              />
            </div>
            
            <div>
              <label htmlFor="teeSelection" className="block text-sm font-medium text-foreground/70 mb-1">
                Tee
              </label>
              <select
                id="teeSelection"
                value={tee}
                onChange={(e) => setTee(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-1 focus:ring-ring transition-all"
              >
                {tees.map((teeOption) => (
                  <option key={teeOption.id} value={teeOption.id}>
                    {teeOption.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={handleAddPlayer}
            disabled={!name.trim() || handicapIndex === "" || !tee}
            className="w-full md:w-auto px-4 py-2 rounded-lg font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Player</span>
          </button>
        </div>
      </div>
      
      {players.length > 0 && (
        <div className="card p-5">
          <h3 className="heading-3 mb-4">Players ({players.length})</h3>
          
          <div className="space-y-3">
            {players.map((player) => {
              const playerTee = tees.find(t => t.id === player.tee);
              
              return (
                <div 
                  key={player.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center space-x-3">
                    <div className="icon-container">
                      <User size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium">{player.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-foreground/70">
                        <span>Handicap: {player.handicapIndex}</span>
                        <span>•</span>
                        <span>Tee: {playerTee?.name || player.tee}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onRemovePlayer(player.id)}
                    className="p-2 rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
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

export default PlayerSetup;
