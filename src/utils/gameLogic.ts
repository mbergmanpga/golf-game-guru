
import { GameType, HoleScore, PlayerHandicap, RoundSetup, Tee } from "./types";

/**
 * Calculate the course handicap for a player
 */
export const calculateCourseHandicap = (
  handicapIndex: number,
  slope: number,
  rating: number,
  par: number
): number => {
  return Math.round(handicapIndex * (slope / 113) + (rating - par));
};

/**
 * Calculate the adjusted handicap based on the percentage for the game
 */
export const calculateAdjustedHandicap = (
  courseHandicap: number,
  handicapPercentage: number
): number => {
  return Math.round(courseHandicap * (handicapPercentage / 100));
};

/**
 * Calculate the net score for a hole
 */
export const calculateNetScore = (
  grossScore: number,
  courseHandicap: number,
  holeHandicap: number,
  totalHoles: number
): number => {
  // Calculate strokes received on this hole
  const strokesPerHole = Math.floor(courseHandicap / totalHoles);
  const extraStrokes = courseHandicap % totalHoles;
  
  // If hole handicap is less than or equal to the extra strokes, receive an additional stroke
  const strokesReceived = strokesPerHole + (holeHandicap <= extraStrokes ? 1 : 0);
  
  return grossScore - strokesReceived;
};

/**
 * Calculate the points for Bingo Bango Bongo on a hole
 */
export const calculateBingoBangoBongoPoints = (
  playerScores: HoleScore[],
  playerId: string
): number => {
  // This is a simplified version. In a real app, you would need more data:
  // - First on green (Bingo)
  // - Closest to pin after all on green (Bango)
  // - First in hole (Bongo)
  
  // For this example, we'll assign 1 point to the player with the lowest score
  const lowestScore = Math.min(...playerScores.map(score => score.netScore));
  const playerScore = playerScores.find(score => score.playerId === playerId)?.netScore || 0;
  
  return playerScore === lowestScore ? 1 : 0;
};

/**
 * Calculate the points for Wolf on a hole
 */
export const calculateWolfPoints = (
  playerScores: HoleScore[],
  players: string[],
  hole: number,
  playerId: string
): number => {
  // This is a simplified version. Wolf is complex and requires:
  // - Determining who is the Wolf (rotates each hole)
  // - Wolf choosing a partner or going alone
  // - Calculating team scores
  
  // For this example, we'll use a simplified version where the Wolf is determined by hole number
  const wolfIndex = (hole - 1) % players.length;
  const wolfId = players[wolfIndex];
  
  // Simplified scoring - Wolf gets 2 points if they have the lowest score, others get 1 point for lowest score
  const lowestScore = Math.min(...playerScores.map(score => score.netScore));
  const playerScore = playerScores.find(score => score.playerId === playerId)?.netScore || 0;
  
  if (playerScore === lowestScore) {
    return playerId === wolfId ? 2 : 1;
  }
  
  return 0;
};

/**
 * Calculate the points for Four Ball on a hole
 */
export const calculateFourBallPoints = (
  playerScores: HoleScore[],
  teams: [string, string][],
  playerId: string
): number => {
  // Find the player's team
  const playerTeam = teams.find(team => team.includes(playerId));
  if (!playerTeam) return 0;
  
  // Find the other team
  const otherTeam = teams.find(team => !team.includes(playerId));
  if (!otherTeam) return 0;
  
  // Get the best score from each team
  const playerTeamScores = playerScores.filter(score => 
    playerTeam.includes(score.playerId)
  );
  const playerTeamBestScore = Math.min(...playerTeamScores.map(score => score.netScore));
  
  const otherTeamScores = playerScores.filter(score => 
    otherTeam.includes(score.playerId)
  );
  const otherTeamBestScore = Math.min(...otherTeamScores.map(score => score.netScore));
  
  // Award points based on team performance
  if (playerTeamBestScore < otherTeamBestScore) {
    return 1; // Player's team won the hole
  } else if (playerTeamBestScore === otherTeamBestScore) {
    return 0.5; // Halved hole
  }
  
  return 0; // Player's team lost the hole
};

/**
 * Calculate the points for stroke play on a hole (not used for scoring, just for tracking)
 */
export const calculateStrokePlayPoints = (
  netScore: number,
  par: number
): number => {
  // For tracking purposes, we'll use a positive score to represent strokes under par
  return par - netScore;
};

/**
 * Calculate points for a specific game type
 */
export const calculateGamePoints = (
  gameType: GameType,
  playerScores: HoleScore[],
  roundSetup: RoundSetup,
  playerId: string,
  hole: number,
  par: number
): number => {
  switch (gameType) {
    case "bingoBangoBongo":
      return calculateBingoBangoBongoPoints(playerScores, playerId);
    
    case "wolf":
      return calculateWolfPoints(
        playerScores, 
        roundSetup.players.map(p => p.id), 
        hole, 
        playerId
      );
    
    case "fourBall":
      // This would require team information that we're not tracking in this example
      // For simplicity, we'll assume the first two players are a team and the last two are a team
      const teams: [string, string][] = [
        [roundSetup.players[0].id, roundSetup.players[1].id],
        [roundSetup.players[2].id, roundSetup.players[3].id]
      ];
      return calculateFourBallPoints(playerScores, teams, playerId);
    
    case "stroke":
      // For stroke play, we're just tracking scores, not points
      const playerScore = playerScores.find(score => score.playerId === playerId);
      return playerScore ? calculateStrokePlayPoints(playerScore.netScore, par) : 0;
    
    default:
      return 0;
  }
};
