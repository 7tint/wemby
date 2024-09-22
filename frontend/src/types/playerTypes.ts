import { Team } from "./teamTypes";

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

export interface PlayerInjury {
  id: number;
  longComment: string | null;
  shortComment: string | null;
  status: string;
  date: string;
  details: {
    type: string;
    location: string;
    detail?: string;
    side?: string;
    returnDate: string;
  };
}

export interface PlayerDraft {
  year: number;
  round: number;
  selection: number;
}

export interface Player {
  id: number; // ESPN Player ID
  firstName: string;
  lastName: string;
  teamId: number;
  team: Team;
  age: number | null;
  headshot: string;
  yearsPro: number;
  jersey: number | null;
  height: number;
  weight: number;
  injuries: PlayerInjury[];
  draft: PlayerDraft | null;
  rank: number;
  adp: number | null; // Average Draft Position
  positions: string[]; // List of position eligibilities
  stats: PlayerStats;
  nScores: PlayerStatsNScore | null;
  trend: "up" | "down" | "equal";
  changedTeams: boolean;
  auctionValuedAt: number | null;
  auctionYahooAvg: number | null;
  auctionEspnAvg: number | null;
  auctionBlendAvg: number | null;
}
