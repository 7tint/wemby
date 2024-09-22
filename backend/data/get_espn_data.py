import logging
import requests

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def get_rosters():
    teams_url = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams"
    teams_response = requests.get(teams_url)
    teams_data = teams_response.json()

    teams_list = teams_data["sports"][0]["leagues"][0]["teams"]

    players_list = []
    for team in teams_list:
        team_id = int(team["team"]["id"])
        roster_url = f"https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/{team_id}?enable=roster"
        roster_response = requests.get(roster_url)
        roster_data = roster_response.json()
        roster_players = roster_data["team"]["athletes"]

        # TODO: get draft year

        for player in roster_players:
            try:
                player_data = {
                    "id": int(player["id"]),
                    "first_name": player["firstName"],
                    "last_name": player["lastName"],
                    "display_name": player["displayName"],
                    "team_id": team_id,
                    "team": team["team"]["abbreviation"],
                    "age": int(player["age"]) if "age" in player else None,
                    "headshot": (
                        (player["headshot"]["href"])
                        if "headshot" in player
                        else "https://secure.espncdn.com/combiner/i?img=/i/headshots/nophoto.png"
                    ),
                    "years_pro": int(player["experience"]["years"]),
                    "jersey": int(player["jersey"]) if "jersey" in player else None,
                }
                players_list.append(player_data)

            except:
                logger.error(f"Error parsing player data: {player}")

    return players_list
