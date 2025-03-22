
import React, { createContext, useContext, useReducer } from "react";
import { 
  Course, 
  GameSetup, 
  HoleScore, 
  PlayerHandicap, 
  RoundData, 
  RoundSetup 
} from "../utils/types";

// Sample initial data
const sampleCourses: Course[] = [
  {
    id: "course1",
    name: "Pine Valley Golf Club",
    tees: [
      {
        id: "tee1",
        name: "Championship",
        rating: 74.8,
        slope: 155,
        pars: [4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 3, 4, 4, 3, 5, 4, 4, 5],
        handicaps: [7, 17, 15, 1, 9, 11, 5, 13, 3, 8, 16, 2, 10, 18, 6, 12, 4, 14]
      },
      {
        id: "tee2",
        name: "Regular",
        rating: 72.4,
        slope: 145,
        pars: [4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 3, 4, 4, 3, 5, 4, 4, 5],
        handicaps: [7, 17, 15, 1, 9, 11, 5, 13, 3, 8, 16, 2, 10, 18, 6, 12, 4, 14]
      },
      {
        id: "tee3",
        name: "Forward",
        rating: 70.1,
        slope: 135,
        pars: [4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 3, 4, 4, 3, 5, 4, 4, 5],
        handicaps: [7, 17, 15, 1, 9, 11, 5, 13, 3, 8, 16, 2, 10, 18, 6, 12, 4, 14]
      }
    ]
  },
  {
    id: "course2",
    name: "Augusta National",
    tees: [
      {
        id: "tee4",
        name: "Masters",
        rating: 76.2,
        slope: 148,
        pars: [4, 5, 4, 3, 4, 3, 4, 5, 4, 4, 4, 3, 5, 4, 5, 3, 4, 4],
        handicaps: [4, 10, 2, 14, 6, 16, 8, 12, 1, 5, 3, 18, 11, 7, 9, 17, 13, 15]
      },
      {
        id: "tee5",
        name: "Tournament",
        rating: 74.2,
        slope: 140,
        pars: [4, 5, 4, 3, 4, 3, 4, 5, 4, 4, 4, 3, 5, 4, 5, 3, 4, 4],
        handicaps: [4, 10, 2, 14, 6, 16, 8, 12, 1, 5, 3, 18, 11, 7, 9, 17, 13, 15]
      }
    ]
  }
];

type GameState = {
  courses: Course[];
  currentRound: RoundSetup | null;
  roundData: RoundData | null;
  isLoading: boolean;
  error: string | null;
};

type GameAction =
  | { type: "SET_COURSES"; payload: Course[] }
  | { type: "CREATE_ROUND"; payload: RoundSetup }
  | { type: "UPDATE_ROUND"; payload: Partial<RoundSetup> }
  | { type: "SET_CURRENT_HOLE"; payload: number }
  | { type: "RECORD_SCORE"; payload: HoleScore }
  | { type: "RESET_ROUND" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: GameState = {
  courses: sampleCourses, // Pre-populated with sample courses
  currentRound: null,
  roundData: null,
  isLoading: false,
  error: null
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "SET_COURSES":
      return {
        ...state,
        courses: action.payload
      };
    
    case "CREATE_ROUND":
      return {
        ...state,
        currentRound: action.payload,
        roundData: {
          roundId: action.payload.id,
          scores: [],
          gameScores: []
        }
      };
    
    case "UPDATE_ROUND":
      if (!state.currentRound) return state;
      return {
        ...state,
        currentRound: {
          ...state.currentRound,
          ...action.payload
        }
      };
    
    case "SET_CURRENT_HOLE":
      if (!state.currentRound) return state;
      return {
        ...state,
        currentRound: {
          ...state.currentRound,
          currentHole: action.payload
        }
      };
    
    case "RECORD_SCORE":
      if (!state.roundData) return state;
      
      // Check if we already have a score for this player and hole
      const existingScoreIndex = state.roundData.scores.findIndex(
        score => 
          score.playerId === action.payload.playerId && 
          score.hole === action.payload.hole
      );
      
      let updatedScores;
      if (existingScoreIndex >= 0) {
        // Update existing score
        updatedScores = [...state.roundData.scores];
        updatedScores[existingScoreIndex] = action.payload;
      } else {
        // Add new score
        updatedScores = [...state.roundData.scores, action.payload];
      }
      
      return {
        ...state,
        roundData: {
          ...state.roundData,
          scores: updatedScores
        }
      };
    
    case "RESET_ROUND":
      return {
        ...state,
        currentRound: null,
        roundData: null
      };
    
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload
      };
    
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null
      };
    
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload
      };
    
    default:
      return state;
  }
};

type GameContextType = {
  state: GameState;
  setupNewRound: (courseId: string, players: PlayerHandicap[], games: GameSetup[]) => void;
  addPlayer: (player: PlayerHandicap) => void;
  removePlayer: (playerId: string) => void;
  addGame: (game: GameSetup) => void;
  removeGame: (gameId: string) => void;
  recordScore: (playerId: string, hole: number, grossScore: number, netScore: number, gamePoints?: Record<string, number>) => void;
  navigateToHole: (hole: number) => void;
  resetRound: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setupNewRound = (courseId: string, players: PlayerHandicap[], games: GameSetup[]) => {
    const newRound: RoundSetup = {
      id: `round-${Date.now()}`,
      date: new Date(),
      courseId,
      players,
      games,
      currentHole: 1,
      totalHoles: 18 // Default to 18 holes
    };
    
    dispatch({ type: "CREATE_ROUND", payload: newRound });
  };

  const addPlayer = (player: PlayerHandicap) => {
    if (!state.currentRound) return;
    
    const updatedPlayers = [...state.currentRound.players, player];
    dispatch({ 
      type: "UPDATE_ROUND", 
      payload: { players: updatedPlayers } 
    });
  };

  const removePlayer = (playerId: string) => {
    if (!state.currentRound) return;
    
    const updatedPlayers = state.currentRound.players.filter(p => p.id !== playerId);
    dispatch({ 
      type: "UPDATE_ROUND", 
      payload: { players: updatedPlayers } 
    });
  };

  const addGame = (game: GameSetup) => {
    if (!state.currentRound) return;
    
    const updatedGames = [...state.currentRound.games, game];
    dispatch({ 
      type: "UPDATE_ROUND", 
      payload: { games: updatedGames } 
    });
  };

  const removeGame = (gameId: string) => {
    if (!state.currentRound) return;
    
    const updatedGames = state.currentRound.games.filter(g => g.id !== gameId);
    dispatch({ 
      type: "UPDATE_ROUND", 
      payload: { games: updatedGames } 
    });
  };

  const recordScore = (
    playerId: string, 
    hole: number, 
    grossScore: number, 
    netScore: number, 
    gamePoints?: Record<string, number>
  ) => {
    const newScore: HoleScore = {
      playerId,
      hole,
      grossScore,
      netScore,
      points: gamePoints
    };
    
    dispatch({ type: "RECORD_SCORE", payload: newScore });
  };

  const navigateToHole = (hole: number) => {
    dispatch({ type: "SET_CURRENT_HOLE", payload: hole });
  };

  const resetRound = () => {
    dispatch({ type: "RESET_ROUND" });
  };

  return (
    <GameContext.Provider value={{
      state,
      setupNewRound,
      addPlayer,
      removePlayer,
      addGame,
      removeGame,
      recordScore,
      navigateToHole,
      resetRound
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
