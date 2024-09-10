export interface PlayerStats {
  gp: number;
  mpg: number;
  fgm: number;
  fga: number;
  fgPct: number;
  ftm: number;
  fta: number;
  ftPct: number;
  tpm: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
}

export interface PlayerStatsNScore {
  fg: number;
  ft: number;
  tpm: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
  total: number;
}

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
