interface StatCategory {
  max: number;
  mean: number;
  min: number;
  std: number;
}

export const STAT_KEYS_NO_FG_FT = [
  "tpm",
  "pts",
  "reb",
  "ast",
  "stl",
  "blk",
  "to",
] as const;

export const STAT_KEYS = ["fg", "ft", ...STAT_KEYS_NO_FG_FT] as const;

export interface CategoryStats {
  fgm: StatCategory;
  fga: StatCategory;
  fgImpact: StatCategory;
  ftm: StatCategory;
  fta: StatCategory;
  ftImpact: StatCategory;
  tpm: StatCategory;
  pts: StatCategory;
  reb: StatCategory;
  ast: StatCategory;
  stl: StatCategory;
  blk: StatCategory;
  to: StatCategory;
}

export const EMPTY_CATEGORY_STATS: CategoryStats = {
  fgm: { max: 0, mean: 0, min: 0, std: 0 },
  fga: { max: 0, mean: 0, min: 0, std: 0 },
  fgImpact: { max: 0, mean: 0, min: 0, std: 0 },
  ftm: { max: 0, mean: 0, min: 0, std: 0 },
  fta: { max: 0, mean: 0, min: 0, std: 0 },
  ftImpact: { max: 0, mean: 0, min: 0, std: 0 },
  tpm: { max: 0, mean: 0, min: 0, std: 0 },
  pts: { max: 0, mean: 0, min: 0, std: 0 },
  reb: { max: 0, mean: 0, min: 0, std: 0 },
  ast: { max: 0, mean: 0, min: 0, std: 0 },
  stl: { max: 0, mean: 0, min: 0, std: 0 },
  blk: { max: 0, mean: 0, min: 0, std: 0 },
  to: { max: 0, mean: 0, min: 0, std: 0 },
};
