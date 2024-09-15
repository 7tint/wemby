export interface PlayerStats {
  gp: number;
  mpg: number;
  fgm: number;
  fga: number;
  fgImpact: number;
  ftm: number;
  fta: number;
  ftImpact: number;
  tpm: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
}

export const EMPTY_PLAYER_STATS: PlayerStats = {
  gp: 0,
  mpg: 0,
  fgm: 0,
  fga: 0,
  fgImpact: 0,
  ftm: 0,
  fta: 0,
  ftImpact: 0,
  tpm: 0,
  pts: 0,
  reb: 0,
  ast: 0,
  stl: 0,
  blk: 0,
  to: 0,
};

export interface PlayerStatsNScore {
  fgImpact: number;
  ftImpact: number;
  tpm: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
  total?: number;
}

export const EMPTY_PLAYER_STATS_NSCORE: PlayerStatsNScore = {
  fgImpact: 0,
  ftImpact: 0,
  tpm: 0,
  pts: 0,
  reb: 0,
  ast: 0,
  stl: 0,
  blk: 0,
  to: 0,
};

export interface Player {
  id: number; // ESPN Player ID
  firstName: string;
  lastName: string;
  teamId: number;
  team: string;
  pastYearTeam: string;
  age: number | null;
  headshot: string;
  yearsPro: number;
  jersey: number | null;
  rank: number;
  pastYearRank: number;
  adp: number; // Average Draft Position
  positions: string[]; // List of position eligibilities
  projections: PlayerStats;
  projectionNScores: PlayerStatsNScore | null;
  pastYearStats: PlayerStats | null;
  pastYearNScores: PlayerStatsNScore | null;
  auctionValuedAt: number | null;
  auctionYahooAvg: number | null;
  auctionEspnAvg: number | null;
  auctionBlendAvg: number | null;
}
