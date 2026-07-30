import request from './request';

export interface StartGameResponse {
  gameRunId: string;
  difficultyModifier: number;
}

export interface FinishGameResult {
  outcome: 'win' | 'lose';
  score: number;
  expGained: number;
  petLevel: number;
}

export const startGame = () => request.post<StartGameResponse>('/games/start');

export const finishGame = (id: string, data: { outcome: 'win' | 'lose'; score: number }) =>
  request.post<FinishGameResult>(`/games/${id}/finish`, data);
