import json
import logging
from models import Player, PlayerStats
from data import (
    scrape_projections,
    scrape_past_year_stats,
    scrape_auction_data,
    get_rosters,
)


logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

name_exceptions = [
    ("Kenyon Martin Jr.", "KJ Martin"),
]


def main():
    logger.info("=== Getting ESPN Roster Data ===")
    players_roster_data = get_rosters()  # ESPN Roster Data

    logger.info("=== Getting Hashtag Projections Data ===")
    players_projections = scrape_projections()  # Hashtag Projections

    logger.info("=== Getting Hashtag Past Year Data ===")
    players_past_year_stats = scrape_past_year_stats()  # Hashtag Past Year Stats

    logger.info("=== Getting Hashtag Auction Data ===")
    players_auction_data = scrape_auction_data()  # Hashtag Auction Data

    players = []

    for projections in players_projections:
        name = projections["name"]
        past_year_stats = next(
            (player for player in players_past_year_stats if player["name"] == name),
            None,
        )
        roster_data = next(
            (
                player
                for player in players_roster_data
                if player["display_name"] == name
            ),
            None,
        )
        auction_data = next(
            (player for player in players_auction_data if player["name"] == name),
            None,
        )

        if not roster_data:
            # Check in name exception list
            if name in [exception[0] for exception in name_exceptions]:
                name = next(
                    exception[1]
                    for exception in name_exceptions
                    if exception[0] == name
                )
                roster_data = next(
                    (
                        player
                        for player in players_roster_data
                        if player["display_name"] == name
                    ),
                    None,
                )

            else:
                # Try again with first or last name within the same team
                team = projections["team"]
                first_name = name.split(" ")[0]
                last_name = name.split(" ")[1]
                roster_data = next(
                    (
                        player
                        for player in players_roster_data
                        if player["team"] == team
                        and (
                            player["first_name"] == first_name
                            or player["last_name"] == last_name
                        )
                    ),
                    None,
                )
                if not roster_data:
                    logger.error(f"Could not find roster data for player: {name}")
                    continue

        player = Player(
            id=roster_data["id"],
            first_name=roster_data["first_name"],
            last_name=roster_data["last_name"],
            positions=projections["positions"],
            team_id=roster_data["team_id"],
            team=roster_data["team"],
            age=roster_data["age"],
            headshot=roster_data["headshot"],
            years_pro=roster_data["years_pro"],
            jersey=roster_data["jersey"],
            rank=projections["rank"],
            adp=projections["adp"],
            projections=PlayerStats(
                gp=projections["gp"],
                mpg=projections["mpg"],
                fgm=projections["fgm"],
                fga=projections["fga"],
                ftm=projections["ftm"],
                fta=projections["fta"],
                tpm=projections["3pm"],
                pts=projections["pts"],
                reb=projections["reb"],
                ast=projections["ast"],
                stl=projections["stl"],
                blk=projections["blk"],
                to=projections["to"],
            ),
            past_year_stats=(
                PlayerStats(
                    gp=past_year_stats["gp"],
                    mpg=past_year_stats["mpg"],
                    fgm=past_year_stats["fgm"],
                    fga=past_year_stats["fga"],
                    ftm=past_year_stats["ftm"],
                    fta=past_year_stats["fta"],
                    tpm=past_year_stats["3pm"],
                    pts=past_year_stats["pts"],
                    reb=past_year_stats["reb"],
                    ast=past_year_stats["ast"],
                    stl=past_year_stats["stl"],
                    blk=past_year_stats["blk"],
                    to=past_year_stats["to"],
                )
                if past_year_stats
                else None
            ),
            auction_valued_at=auction_data["valued_at"],
            auction_yahoo_avg=auction_data["yahoo_avg"],
            auction_espn_avg=auction_data["espn_avg"],
            auction_blend_avg=auction_data["blend_avg"],
        )

        players.append(player)

    logger.info("=== Writing to data/players.json ===")
    players_data = [player.__dict__ for player in players]
    for player in players_data:
        player["projections"] = player["projections"].__dict__
        player["past_year_stats"] = (
            player["past_year_stats"].__dict__ if player["past_year_stats"] else None
        )

    with open("data/players.json", "w") as json_file:
        json.dump(players_data, json_file, indent=2)


if __name__ == "__main__":
    main()
