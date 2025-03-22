
import React, { useState } from "react";
import { HoleScore, PlayerHandicap } from "../utils/types";
import { Check, Circle, Flag, Target } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface BingoBangoBongoSelectorProps {
  players: PlayerHandicap[];
  currentHole: number;
  scores: HoleScore[];
  onComplete: (scores: HoleScore[]) => void;
  onCancel: () => void;
}

type BBBField = "bingo" | "bango" | "bongo";

interface BBBSelection {
  bingo: string | null; // PlayerId
  bango: string | null; // PlayerId
  bongo: string | null; // PlayerId
}

export const BingoBangoBongoSelector: React.FC<BingoBangoBongoSelectorProps> = ({
  players,
  currentHole,
  scores,
  onComplete,
  onCancel
}) => {
  const [selection, setSelection] = useState<BBBSelection>({
    bingo: null,
    bango: null,
    bongo: null
  });

  const handleSelection = (field: BBBField, playerId: string) => {
    setSelection(prev => ({
      ...prev,
      [field]: playerId
    }));
  };

  const handleSubmit = () => {
    // Find the Bingo Bango Bongo game in the scores
    const bbbGameId = scores[0]?.points ? 
      Object.keys(scores[0].points).find(id => 
        id.includes("bingo") || id.toLowerCase().includes("bango")
      ) : null;

    if (!bbbGameId) {
      onComplete(scores);
      return;
    }

    // Calculate points based on selection
    const updatedScores = scores.map(score => {
      // Start with existing points or initialize
      const points = score.points || {};
      
      // Initialize or get current BBB points
      points[bbbGameId] = points[bbbGameId] || 0;
      
      // Award 1 point for each achievement
      if (selection.bingo === score.playerId) {
        points[bbbGameId] += 1;
      }
      if (selection.bango === score.playerId) {
        points[bbbGameId] += 1;
      }
      if (selection.bongo === score.playerId) {
        points[bbbGameId] += 1;
      }
      
      return {
        ...score,
        points
      };
    });
    
    onComplete(updatedScores);
  };

  const isComplete = selection.bingo && selection.bango && selection.bongo;

  return (
    <div className="card p-4 space-y-6">
      <div className="text-center mb-4">
        <div className="pill pill-primary mb-2 inline-block">Hole {currentHole}</div>
        <h3 className="text-lg font-semibold">Bingo Bango Bongo</h3>
        <p className="text-sm text-muted-foreground">Select which player achieved each feat</p>
      </div>

      <div className="space-y-6">
        {/* First on the green (Bingo) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Circle size={18} className="text-golf-darkGreen" />
            <h4 className="font-medium">First on the green (Bingo)</h4>
          </div>
          <RadioGroup
            value={selection.bingo || ""}
            onValueChange={(value) => handleSelection("bingo", value)}
            className="grid grid-cols-1 gap-2"
          >
            {players.map((player) => (
              <div key={`bingo-${player.id}`} className="flex items-center space-x-2">
                <RadioGroupItem value={player.id} id={`bingo-${player.id}`} />
                <Label htmlFor={`bingo-${player.id}`} className="cursor-pointer">
                  {player.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Closest to the hole (Bango) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Target size={18} className="text-golf-navy" />
            <h4 className="font-medium">Closest to the hole (Bango)</h4>
          </div>
          <RadioGroup
            value={selection.bango || ""}
            onValueChange={(value) => handleSelection("bango", value)}
            className="grid grid-cols-1 gap-2"
          >
            {players.map((player) => (
              <div key={`bango-${player.id}`} className="flex items-center space-x-2">
                <RadioGroupItem value={player.id} id={`bango-${player.id}`} />
                <Label htmlFor={`bango-${player.id}`} className="cursor-pointer">
                  {player.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* First in the hole (Bongo) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Flag size={18} className="text-golf-darkGreen" />
            <h4 className="font-medium">First in the hole (Bongo)</h4>
          </div>
          <RadioGroup
            value={selection.bongo || ""}
            onValueChange={(value) => handleSelection("bongo", value)}
            className="grid grid-cols-1 gap-2"
          >
            {players.map((player) => (
              <div key={`bongo-${player.id}`} className="flex items-center space-x-2">
                <RadioGroupItem value={player.id} id={`bongo-${player.id}`} />
                <Label htmlFor={`bongo-${player.id}`} className="cursor-pointer">
                  {player.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-4">
        <button
          onClick={onCancel}
          className="py-2 px-4 rounded-lg border border-input bg-background hover:bg-accent transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="py-2 px-4 rounded-lg flex items-center space-x-1 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          <Check size={18} />
          <span>Continue</span>
        </button>
      </div>
    </div>
  );
};
