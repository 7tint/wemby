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
