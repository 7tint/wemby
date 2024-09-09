import { Player, PlayerStats, PlayerStatsNScore } from "@/types/playerTypes";

export const CATEGORIES = [
  "fgm",
  "fga",
  "ftm",
  "fta",
  "tpm",
  "pts",
  "reb",
  "ast",
  "stl",
  "blk",
  "to",
] as const;

export const MIN_MINUTES = 20;

export const getStats = (
  player: Player,
  usePastYearStats: boolean
): PlayerStats =>
  usePastYearStats ? player.pastYearStats! : player.projections;

export const getNStats = (
  player: Player,
  usePastYearStats: boolean
): PlayerStatsNScore | null =>
  usePastYearStats ? player.pastYearNScores! : player.projectionNScores;
