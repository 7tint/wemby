export interface PlayerStats {
  gp: number;
  mpg: number;
  fgm: number;
  fga: number;
  fg_pct: number;
  ftm: number;
  fta: number;
  ft_pct: number;
  tpm: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
}

export interface PlayerZScores {
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
  first_name: string;
  last_name: string;
  team_id: number;
  team: string;
  age: number | null;
  headshot: string;
  years_pro: number;
  jersey: number | null;
  rank: number; // Rank in projections
  adp: number; // Average Draft Position
  positions: string[]; // List of position eligibilities
  projections: PlayerStats;
  projection_z_scores: PlayerZScores | null;
  past_year_stats: PlayerStats | null;
  past_year_z_scores: PlayerZScores | null;
  auction_valued_at: number | null;
  auction_yahoo_avg: number | null;
  auction_espn_avg: number | null;
  auction_blend_avg: number | null;
}
