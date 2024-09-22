interface StatCategory {
  max: number;
  mean: number;
  min: number;
  std: number;
}

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
