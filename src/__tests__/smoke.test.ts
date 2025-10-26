import { describe, it, expect } from 'vitest';
import { gameReducer } from '../contexts/GameContext';
import type { RoundSetup } from '../utils/types';

describe('gameReducer smoke tests', () => {
  it('CREATE_ROUND initializes currentRound and roundData', () => {
    const initialState: any = {
      courses: [],
      currentRound: null,
      roundData: null,
      isLoading: false,
      error: null
    };

    const newRound: RoundSetup = {
      id: 'round-123',
      date: new Date(),
      courseId: 'course1',
      players: [],
      games: [],
      currentHole: 1,
      totalHoles: 18
    };

    const action = { type: 'CREATE_ROUND', payload: newRound } as any;
    const next = gameReducer(initialState, action);

    expect(next.currentRound).toBeTruthy();
    expect(next.currentRound.id).toBe('round-123');
    expect(next.roundData).toBeTruthy();
    expect(next.roundData.roundId).toBe('round-123');
    expect(Array.isArray(next.roundData.scores)).toBe(true);
  });
});
