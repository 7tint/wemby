import { EMPTY_PLAYER_STATS, EMPTY_PLAYER_STATS_NSCORE } from "@/utils/consts";
import { shrinkNumber } from "./math";
import { Player, PlayerStats, PlayerStatsNScore } from "@/types/playerTypes";

export const getStats = (player: Player): PlayerStats =>
  player.stats === null ? EMPTY_PLAYER_STATS : player.stats;

export const getNStats = (player: Player): PlayerStatsNScore =>
  player.nScores === null ? EMPTY_PLAYER_STATS_NSCORE : player.nScores;

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
    fgImpact: shrinkNumber(score.fgImpact + 2.4),
    ftImpact: shrinkNumber(score.ftImpact + 2.4),
    tpm: shrinkNumber(score.tpm + 2.4),
    pts: shrinkNumber(score.pts + 2.4),
    reb: shrinkNumber(score.reb + 2.4),
    ast: shrinkNumber(score.ast + 2.4),
    stl: shrinkNumber(score.stl + 2.4),
    blk: shrinkNumber(score.blk + 2.4),
    to: score.to / 2.5,
    total: 0,
  };
  return newScores;
};

export const totalCategories = (
  categories: PlayerStatsNScore,
  punts: Set<string>
): number => {
  let total = 0;
  if (!punts.has("fg")) total += categories.fgImpact;
  if (!punts.has("ft")) total += categories.ftImpact;
  if (!punts.has("tpm")) total += categories.tpm;
  if (!punts.has("pts")) total += categories.pts;
  if (!punts.has("reb")) total += categories.reb;
  if (!punts.has("ast")) total += categories.ast;
  if (!punts.has("stl")) total += categories.stl;
  if (!punts.has("blk")) total += categories.blk;
  if (!punts.has("to")) total += categories.to;
  return total;
};
