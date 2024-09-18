export const TEAM_ABBREVS = [
  "ATL",
  "BOS",
  "BKN",
  "CHA",
  "CHI",
  "CLE",
  "DAL",
  "DEN",
  "DET",
  "GS",
  "HOU",
  "IND",
  "LAC",
  "LAL",
  "MEM",
  "MIA",
  "MIL",
  "MIN",
  "NO",
  "NY",
  "OKC",
  "ORL",
  "PHI",
  "PHX",
  "POR",
  "SAC",
  "SA",
  "TOR",
  "UTAH",
  "WSH",
  "NBA",
] as const;

export type Team = (typeof TEAM_ABBREVS)[number];

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
