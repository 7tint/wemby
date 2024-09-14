import { shrinkNumber } from "./math";
import {
  EMPTY_PLAYER_STATS,
  EMPTY_PLAYER_STATS_NSCORE,
  Player,
  PlayerStats,
  PlayerStatsNScore,
} from "@/types/playerTypes";

export const getStats = (
  player: Player,
  usePastYearStats: boolean
): PlayerStats =>
  usePastYearStats
    ? player.pastYearStats === null
      ? EMPTY_PLAYER_STATS
      : player.pastYearStats
    : player.projections;

export const getNStats = (
  player: Player,
  usePastYearStats: boolean
): PlayerStatsNScore =>
  usePastYearStats
    ? player.pastYearNScores === null
      ? EMPTY_PLAYER_STATS_NSCORE
      : player.pastYearNScores!
    : player.projectionNScores === null
    ? EMPTY_PLAYER_STATS_NSCORE
    : player.projectionNScores!;

export const calculateStatPercentiles = (stat: number, category: string) => {
  switch (category) {
    case "fg":
      if (stat >= 0.535) return 4;
      if (stat >= 0.49) return 3;
      if (stat >= 0.465) return 2;
      if (stat >= 0.445) return 1;
      return 0;
    case "ft":
      if (stat >= 0.85) return 4;
      if (stat >= 0.81) return 3;
      if (stat >= 0.775) return 2;
      if (stat >= 0.72) return 1;
      return 0;
    case "tpm":
      if (stat >= 2.85) return 4;
      if (stat >= 2) return 3;
      if (stat >= 1.45) return 2;
      if (stat >= 1) return 1;
      return 0;
    case "pts":
      if (stat >= 24.5) return 4;
      if (stat >= 19) return 3;
      if (stat >= 15) return 2;
      if (stat >= 11) return 1;
      return 0;
    case "reb":
      if (stat >= 10) return 4;
      if (stat >= 6) return 3;
      if (stat >= 4.3) return 2;
      if (stat >= 3.5) return 1;
      return 0;
    case "ast":
      if (stat >= 6) return 4;
      if (stat >= 4.6) return 3;
      if (stat >= 3.5) return 2;
      if (stat >= 2.5) return 1;
      return 0;
    case "stl":
      if (stat >= 1.4) return 4;
      if (stat >= 1) return 3;
      if (stat >= 0.7) return 2;
      if (stat >= 0.5) return 1;
      return 0;
    case "blk":
      if (stat >= 1.2) return 4;
      if (stat >= 0.8) return 3;
      if (stat >= 0.6) return 2;
      if (stat >= 0.4) return 1;
      return 0;
    case "to":
      if (stat < 1.4) return 4;
      if (stat < 1.7) return 3;
      if (stat < 2.3) return 2;
      if (stat < 2.9) return 1;
      return 0;
    case "fga":
    case "fta":
      return stat / 100;
    default:
      return 0;
  }
};

export const normalizeScores = (
  score: PlayerStatsNScore
): PlayerStatsNScore => {
  const newScores = {
    fgImpact: shrinkNumber(score.fgImpact + 1.5),
    ftImpact: shrinkNumber(score.ftImpact + 1.5),
    tpm: shrinkNumber(score.tpm + 1.5),
    pts: shrinkNumber(score.pts + 1.5),
    reb: shrinkNumber(score.reb + 1.5),
    ast: shrinkNumber(score.ast + 1.5),
    stl: shrinkNumber(score.stl + 1.5),
    blk: shrinkNumber(score.blk + 1.5),
    to: shrinkNumber(score.to + 1.5),
    total: 0,
  };
  return newScores;
};

export const totalCategories = (
  categories: PlayerStatsNScore,
  punts: string[]
): number => {
  let total = 0;
  Object.entries(categories).forEach(([category, score]) => {
    if (category === "fgImpact") category = "fg";
    if (category === "ftImpact") category = "ft";
    if (!punts.includes(category)) total += score;
  });
  return total;
};
