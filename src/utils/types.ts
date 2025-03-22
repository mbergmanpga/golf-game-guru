
export type PlayerHandicap = {
  id: string;
  name: string;
  handicapIndex: number;
  tee: string;
};

export type Course = {
  id: string;
  name: string;
  tees: Tee[];
};

export type Tee = {
  id: string;
  name: string;
  rating: number;
  slope: number;
  pars: number[];
  handicaps: number[];
};

export type GameType = 
  | "stroke" 
  | "bingoBangoBongo" 
  | "wolf" 
  | "fourBall";

export type GameSetup = {
  id: string;
  type: GameType;
  handicapPercentage: number;
  players: string[]; // Player IDs
};

export type RoundSetup = {
  id: string;
  date: Date;
  courseId: string;
  players: PlayerHandicap[];
  games: GameSetup[];
  currentHole: number;
  totalHoles: number;
};

export type HoleScore = {
  playerId: string;
  hole: number;
  grossScore: number;
  netScore: number;
  points?: {
    [gameId: string]: number;
  };
};

export type GameScore = {
  gameId: string;
  playerId: string;
  totalPoints: number;
  pointsByHole: number[];
};

export type RoundData = {
  roundId: string;
  scores: HoleScore[];
  gameScores: GameScore[];
};
