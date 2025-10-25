import React, { useState } from "react";
import { PlayerHandicap } from "../utils/types";
import { Plus, Trash2, User } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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
      <div className="card">
        <h2 className="heading-2 mb-4">Add Players</h2>
        
        <div className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Player Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter player name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Handicap Index
              </label>
              <Input
                type="number"
                value={handicapIndex.toString()}
                onChange={(e) => setHandicapIndex(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Enter handicap"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Tee
              </label>
              <Input
                value={tee}
                onChange={(e) => setTee(e.target.value)}
                placeholder="Select tee"
              />
            </div>
          </div>
          
          <Button
            onClick={handleAddPlayer}
            disabled={!name.trim() || handicapIndex === "" || !tee}
            className="gap-2"
          >
            <Plus size={16} />
            Add Player
          </Button>
        </div>
      </div>
      
      {players.length > 0 && (
        <div className="card">
          <h2 className="heading-2 mb-4">Players ({players.length})</h2>
          
          <div className="space-y-3">
            {players.map((player) => {
              const playerTee = tees.find(t => t.id === player.tee);
              
              return (
                <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Handicap: {player.handicapIndex}</span>
                        <span>•</span>
                        <span>Tee: {playerTee?.name || player.tee}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemovePlayer(player.id)}
                  >
                    <Trash2 size={18} className="text-destructive" />
                  </Button>
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
