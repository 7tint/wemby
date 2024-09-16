import json
import logging
import sys
from models import Player, PlayerStats
from data import (
    calc_categories,
    scrape_projections,
    scrape_past_year_stats,
    scrape_auction_data,
    get_rosters,
)


logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

name_exceptions = [("Kenyon Martin Jr.", "KJ Martin"), ("Boogie Ellis", "SKIP")]

category_keys = [
    "fgm",
    "fga",
    "ftm",
    "fta",
    "tpm",
    "pts",
    "reb",
    "ast",
    "stl",
    "blk",
    "to",
    "fg_impact",
    "ft_impact",
]

proj_year_key = "2024"
past_year_key = "2023"


def main():
    year_key = proj_year_key
    n = len(sys.argv)
    if n == 2:
        if sys.argv[1] not in [proj_year_key, past_year_key]:
            logger.error("Invalid year key. Must be 2023 or 2024")
            return
        year_key = sys.argv[1]

    logger.info("=== Getting ESPN Roster Data ===")
    players_roster_data = get_rosters()  # ESPN Roster Data

    players_hashtag = []
    players_auction_data = []
    if year_key == proj_year_key:
        logger.info("=== Getting Hashtag Projections Data ===")
        players_hashtag = scrape_projections()  # Hashtag Projections

        logger.info("=== Getting Hashtag Auction Data ===")
        players_auction_data = scrape_auction_data()  # Hashtag Auction Data

    else:
        logger.info("=== Getting Hashtag Past Year Data ===")
        players_hashtag = scrape_past_year_stats()  # Hashtag Past Year Stats

    """
    ========================================
    Helper Functions
    ========================================
    """

    def get_roster_data(player):
        name = player["name"]
        roster_data = next(
            (
                player
                for player in players_roster_data
                if player["display_name"] == name
            ),
            None,
        )
        if not roster_data:
            if name in [exception[0] for exception in name_exceptions]:
                new_name = next(
                    exception[1]
                    for exception in name_exceptions
                    if exception[0] == name
                )
                if new_name == "SKIP":
                    logger.error(f"Manually skipping player: {name}")
                    return None

                else:
                    roster_data = next(
                        (
                            player
                            for player in players_roster_data
                            if player["display_name"] == new_name
                        ),
                        None,
                    )

            else:
                # Try again with first or last name within the same team
                team = player["team"]
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
                    return None
        return roster_data

    def get_auction_data(player):
        if len(players_auction_data) == 0:
            return None
        curr_name = player["name"]
        auction_data = next(
            (player for player in players_auction_data if player["name"] == curr_name),
            None,
        )
        return auction_data

    """
    ========================================
    Data Processing
    ========================================
    """
    # Sums for calculating means
    category_sums_totals = [0] * 11
    category_sums_per = [0] * 11

    # Min and Max for each category
    category_stats_totals = {}
    category_stats_per = {}

    for key in category_keys:
        category_stats_totals[key] = {
            "min": float("inf"),
            "max": float("-inf"),
        }
        category_stats_per[key] = {
            "min": float("inf"),
            "max": float("-inf"),
        }

    players = []

    """
    ========================================
    Build stats for players
    ========================================
    """
    for player in players_hashtag:
        roster_data = get_roster_data(player)
        if not roster_data:
            continue
        auction_data = get_auction_data(player)
        player = Player(
            id=roster_data["id"],
            first_name=roster_data["first_name"],
            last_name=roster_data["last_name"],
            positions=player["positions"],
            team_id=roster_data["team_id"],
            team=roster_data["team"],
            age=roster_data["age"] if "age" in roster_data else None,
            headshot=roster_data["headshot"],
            years_pro=roster_data["years_pro"],
            jersey=roster_data["jersey"] if "jersey" in roster_data else None,
            rank=player["rank"],
            adp=player["adp"] if "adp" in player else None,
            stats=PlayerStats(
                gp=player["gp"],
                mpg=player["mpg"],
                fgm=player["fgm"],
                fga=player["fga"],
                ftm=player["ftm"],
                fta=player["fta"],
                tpm=player["3pm"],
                pts=player["pts"],
                reb=player["reb"],
                ast=player["ast"],
                stl=player["stl"],
                blk=player["blk"],
                to=player["to"],
            ),
            auction_valued_at=auction_data["valued_at"] if auction_data else None,
            auction_yahoo_avg=auction_data["yahoo_avg"] if auction_data else None,
            auction_espn_avg=auction_data["espn_avg"] if auction_data else None,
            auction_blend_avg=auction_data["blend_avg"] if auction_data else None,
        )

        # Update sums, sums of squares, and min/max for each category
        for i, key in enumerate(category_keys):
            if key == "fg_impact" or key == "ft_impact":
                continue
            category_sums_totals[i] += getattr(player.stats, key) * player.stats.gp
            category_stats_totals[key]["min"] = min(
                category_stats_totals[key]["min"],
                getattr(player.stats, key) * player.stats.gp,
            )
            category_stats_totals[key]["max"] = max(
                category_stats_totals[key]["max"],
                getattr(player.stats, key) * player.stats.gp,
            )
            category_sums_per[i] += getattr(player.stats, key)
            category_stats_per[key]["min"] = min(
                category_stats_per[key]["min"], getattr(player.stats, key)
            )
            category_stats_per[key]["max"] = max(
                category_stats_per[key]["max"], getattr(player.stats, key)
            )

        players.append(player)

    """
    ========================================
    Calculate means and stds for each category, for both totals and per game stats
    ========================================
    """
    (
        category_means,
        fg_impact_mean,
        min_fg_impact,
        max_fg_impact,
        ft_impact_mean,
        min_ft_impact,
        max_ft_impact,
    ) = calc_categories(
        players,
        category_sums_totals,
        category_sums_totals[0] / category_sums_totals[1],
        category_sums_totals[2] / category_sums_totals[3],
        True,
    )
    category_stats_totals["fg_impact"]["mean"] = fg_impact_mean
    category_stats_totals["fg_impact"]["min"] = min_fg_impact
    category_stats_totals["fg_impact"]["max"] = max_fg_impact
    category_stats_totals["ft_impact"]["mean"] = ft_impact_mean
    category_stats_totals["ft_impact"]["min"] = min_ft_impact
    category_stats_totals["ft_impact"]["max"] = max_ft_impact

    (
        category_means_per,
        fg_impact_mean_per,
        min_fg_impact_per,
        max_fg_impact_per,
        ft_impact_mean_per,
        min_ft_impact_per,
        max_ft_impact_per,
    ) = calc_categories(
        players,
        category_sums_per,
        category_sums_per[0] / category_sums_per[1],
        category_sums_per[2] / category_sums_per[3],
        False,
    )
    category_stats_per["fg_impact"]["mean"] = fg_impact_mean_per
    category_stats_per["fg_impact"]["min"] = min_fg_impact_per
    category_stats_per["fg_impact"]["max"] = max_fg_impact_per
    category_stats_per["ft_impact"]["mean"] = ft_impact_mean_per
    category_stats_per["ft_impact"]["min"] = min_ft_impact_per
    category_stats_per["ft_impact"]["max"] = max_ft_impact_per

    # Update means
    for category, mean in zip(category_keys, category_means):
        category_stats_totals[category]["mean"] = mean
    for category, mean in zip(category_keys, category_means_per):
        category_stats_per[category]["mean"] = mean

    # Calculate stds
    category_stds_totals = [0] * 13
    category_stds_per = [0] * 13

    for player in players:
        for i, key in enumerate(category_keys):
            gp = player.stats.gp
            category_stds_totals[i] += (
                getattr(player.stats, key) * gp - category_stats_totals[key]["mean"]
            ) ** 2
            category_stds_per[i] += (
                getattr(player.stats, key) - category_stats_per[key]["mean"]
            ) ** 2

    category_stds_totals = [((s / len(players)) ** 0.5) for s in category_stds_totals]
    category_stds_per = [((s / len(players)) ** 0.5) for s in category_stds_per]

    # Update stds
    for category, std in zip(category_keys, category_stds_totals):
        category_stats_totals[category]["std"] = std

    logger.info("=== Writing to data/players.json ===")

    players_data = [player.__dict__ for player in players]
    for player in players_data:
        player["stats"] = player["stats"].__dict__

    json_data = json.load(open("data/players.json"))
    json_data[year_key] = players_data
    json_data[year_key + "_category_stats_totals"] = category_stats_totals
    json_data[year_key + "_category_stats_per"] = category_stats_per

    with open("data/players.json", "w") as json_file:
        json.dump(json_data, json_file, indent=2)


if __name__ == "__main__":
    main()
