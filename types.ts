export enum Difficulty {
  EASY = 'Fácil',
  MEDIUM = 'Médio',
  DIFFICULT = 'Difícil',
}

export interface EquationProblem {
  a: number;
  b: number;
  c: number;
  solution: number;
}
