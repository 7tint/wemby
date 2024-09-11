export type Team =
  | "ATL"
  | "BOS"
  | "BKN"
  | "CHA"
  | "CHI"
  | "CLE"
  | "DAL"
  | "DEN"
  | "DET"
  | "GSW"
  | "HOU"
  | "IND"
  | "LAC"
  | "LAL"
  | "MEM"
  | "MIA"
  | "MIL"
  | "MIN"
  | "NOP"
  | "NYK"
  | "OKC"
  | "ORL"
  | "PHI"
  | "PHX"
  | "POR"
  | "SAC"
  | "SAS"
  | "TOR"
  | "UTA"
  | "WAS"
  | "NBA";

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
    case "GSW":
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
    case "NOP":
      return "New Orleans Pelicans";
    case "NYK":
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
    case "SAS":
      return "San Antonio Spurs";
    case "TOR":
      return "Toronto Raptors";
    case "UTA":
      return "Utah Jazz";
    case "WAS":
      return "Washington Wizards";
    case "NBA":
      return "NBA";
    default:
      return "Unknown Team";
  }
};
