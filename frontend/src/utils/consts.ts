import { PlayerStats, PlayerStatsNScore } from "@/types/playerTypes";
import { CategoryStats } from "@/types/statTypes";
import { Team } from "@/types/teamTypes";

export const YEAR = 2024;

export const PLAYER_POSITIONS = ["PG", "SG", "SF", "PF", "C"];

export const STAT_KEYS = [
  "fg",
  "ft",
  "tpm",
  "pts",
  "reb",
  "ast",
  "stl",
  "blk",
  "to",
] as const;

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

export const getTeamName = (team: Team): string => {
  switch (team) {
    case "ATL":
      return "Atlanta Hawks";
    case "BOS":
      return "Boston Celtics";
    case "BKN":
      return "Brooklyn Nets";
    case "CHA":
      return "Charlotte Hornets";
    case "CHI":
      return "Chicago Bulls";
    case "CLE":
      return "Cleveland Cavaliers";
    case "DAL":
      return "Dallas Mavericks";
    case "DEN":
      return "Denver Nuggets";
    case "DET":
      return "Detroit Pistons";
    case "GS":
      return "Golden State Warriors";
    case "HOU":
      return "Houston Rockets";
    case "IND":
      return "Indiana Pacers";
    case "LAC":
      return "Los Angeles Clippers";
    case "LAL":
      return "Los Angeles Lakers";
    case "MEM":
      return "Memphis Grizzlies";
    case "MIA":
      return "Miami Heat";
    case "MIL":
      return "Milwaukee Bucks";
    case "MIN":
      return "Minnesota Timberwolves";
    case "NO":
      return "New Orleans Pelicans";
    case "NY":
      return "New York Knicks";
    case "OKC":
      return "Oklahoma City Thunder";
    case "ORL":
      return "Orlando Magic";
    case "PHI":
      return "Philadelphia 76ers";
    case "PHX":
      return "Phoenix Suns";
    case "POR":
      return "Portland Trail Blazers";
    case "SAC":
      return "Sacramento Kings";
    case "SA":
      return "San Antonio Spurs";
    case "TOR":
      return "Toronto Raptors";
    case "UTAH":
      return "Utah Jazz";
    case "WSH":
      return "Washington Wizards";
    case "NBA":
      return "NBA";
    default:
      return "Unknown Team";
  }
};

export const getTeamAbbreviation = (team: string): Team => {
  switch (team) {
    case "Atlanta Hawks":
      return "ATL";
    case "Boston Celtics":
      return "BOS";
    case "Brooklyn Nets":
      return "BKN";
    case "Charlotte Hornets":
      return "CHA";
    case "Chicago Bulls":
      return "CHI";
    case "Cleveland Cavaliers":
      return "CLE";
    case "Dallas Mavericks":
      return "DAL";
    case "Denver Nuggets":
      return "DEN";
    case "Detroit Pistons":
      return "DET";
    case "Golden State Warriors":
      return "GS";
    case "Houston Rockets":
      return "HOU";
    case "Indiana Pacers":
      return "IND";
    case "Los Angeles Clippers":
      return "LAC";
    case "Los Angeles Lakers":
      return "LAL";
    case "Memphis Grizzlies":
      return "MEM";
    case "Miami Heat":
      return "MIA";
    case "Milwaukee Bucks":
      return "MIL";
    case "Minnesota Timberwolves":
      return "MIN";
    case "New Orleans Pelicans":
      return "NO";
    case "New York Knicks":
      return "NY";
    case "Oklahoma City Thunder":
      return "OKC";
    case "Orlando Magic":
      return "ORL";
    case "Philadelphia 76ers":
      return "PHI";
    case "Phoenix Suns":
      return "PHX";
    case "Portland Trail Blazers":
      return "POR";
    case "Sacramento Kings":
      return "SAC";
    case "San Antonio Spurs":
      return "SA";
    case "Toronto Raptors":
      return "TOR";
    case "Utah Jazz":
      return "UTAH";
    case "Washington Wizards":
      return "WSH";
    default:
      return "NBA";
  }
};

export const getInjuryAbbreviation = (status: string): string => {
  switch (status) {
    case "Out":
      return "O";
    case "Day-To-Day":
      return "DTD";
    case "Questionable":
      return "Q";
    case "Probable":
      return "P";
    default:
      return "?";
  }
};

export const convertInchesToFeet = (inches: number): string => {
  const feet = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${feet}'${inch}`;
};
