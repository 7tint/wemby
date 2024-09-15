import json
import logging
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
    logger.info("=== Getting ESPN Roster Data ===")
    players_roster_data = get_rosters()  # ESPN Roster Data

    logger.info("=== Getting Hashtag Projections Data ===")
    players_projections = scrape_projections()  # Hashtag Projections

    logger.info("=== Getting Hashtag Past Year Data ===")
    players_past_year_stats = scrape_past_year_stats()  # Hashtag Past Year Stats

    logger.info("=== Getting Hashtag Auction Data ===")
    players_auction_data = scrape_auction_data()  # Hashtag Auction Data

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
    json_data = {}

    # Sums for calculating means
    proj_category_sums_totals = [0] * 11
    past_category_sums_totals = [0] * 11
    proj_category_sums_per = [0] * 11
    past_category_sums_per = [0] * 11

    # Min and Max for each category
    proj_category_stats_totals = {}
    past_category_stats_totals = {}
    proj_category_stats_per = {}
    past_category_stats_per = {}

    for key in category_keys:
        proj_category_stats_totals[key] = {
            "min": float("inf"),
            "max": float("-inf"),
        }
        proj_category_stats_per[key] = {
            "min": float("inf"),
            "max": float("-inf"),
        }
        past_category_stats_totals[key] = {
            "min": float("inf"),
            "max": float("-inf"),
        }
        past_category_stats_per[key] = {
            "min": float("inf"),
            "max": float("-inf"),
        }

    proj_players = []
    past_players = []

    """
    ========================================
    Make projections for players
    ========================================
    """
    for player in players_projections:
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
            age=roster_data["age"],
            headshot=roster_data["headshot"],
            years_pro=roster_data["years_pro"],
            jersey=roster_data["jersey"],
            rank=player["rank"],
            adp=player["adp"],
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
            auction_valued_at=auction_data["valued_at"],
            auction_yahoo_avg=auction_data["yahoo_avg"],
            auction_espn_avg=auction_data["espn_avg"],
            auction_blend_avg=auction_data["blend_avg"],
        )

        # Update sums, sums of squares, and min/max for each category
        for i, key in enumerate(category_keys):
            if key == "fg_impact" or key == "ft_impact":
                continue
            proj_category_sums_totals[i] += getattr(player.stats, key) * player.stats.gp
            proj_category_stats_totals[key]["min"] = min(
                proj_category_stats_totals[key]["min"],
                getattr(player.stats, key) * player.stats.gp,
            )
            proj_category_stats_totals[key]["max"] = max(
                proj_category_stats_totals[key]["max"],
                getattr(player.stats, key) * player.stats.gp,
            )
            proj_category_sums_per[i] += getattr(player.stats, key)
            proj_category_stats_per[key]["min"] = min(
                proj_category_stats_per[key]["min"], getattr(player.stats, key)
            )
            proj_category_stats_per[key]["max"] = max(
                proj_category_stats_per[key]["max"], getattr(player.stats, key)
            )

        proj_players.append(player)

    """
    ========================================
    Make past year stats for players
    ========================================
    """
    for player in players_past_year_stats:
        roster_data = get_roster_data(player)
        if not roster_data:
            continue
        player = Player(
            id=roster_data["id"],
            first_name=roster_data["first_name"],
            last_name=roster_data["last_name"],
            positions=player["positions"],
            team_id=roster_data["team_id"],
            team=roster_data["team"],
            age=roster_data["age"],
            headshot=roster_data["headshot"],
            years_pro=roster_data["years_pro"],
            jersey=roster_data["jersey"],
            rank=player["rank"],
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
        )

        # Update sums, sums of squares, and min/max for each category
        for i, key in enumerate(category_keys):
            if key == "fg_impact" or key == "ft_impact":
                continue
            past_category_sums_totals[i] += getattr(player.stats, key) * player.stats.gp
            past_category_stats_totals[key]["min"] = min(
                past_category_stats_totals[key]["min"],
                getattr(player.stats, key) * player.stats.gp,
            )
            past_category_stats_totals[key]["max"] = max(
                past_category_stats_totals[key]["max"],
                getattr(player.stats, key) * player.stats.gp,
            )
            past_category_sums_per[i] += getattr(player.stats, key)
            past_category_stats_per[key]["min"] = min(
                past_category_stats_per[key]["min"], getattr(player.stats, key)
            )
            past_category_stats_per[key]["max"] = max(
                past_category_stats_per[key]["max"], getattr(player.stats, key)
            )

        past_players.append(player)

    """
    ========================================
    Calculate means and stds for each category, for both totals and per game stats
    ========================================
    """
    (
        proj_category_means,
        proj_fg_impact_mean,
        proj_min_fg_impact,
        proj_max_fg_impact,
        proj_ft_impact_mean,
        proj_min_ft_impact,
        proj_max_ft_impact,
    ) = calc_categories(
        proj_players,
        proj_category_sums_totals,
        proj_category_sums_totals[0] / proj_category_sums_totals[1],
        proj_category_sums_totals[2] / proj_category_sums_totals[3],
        True,
    )
    proj_category_stats_totals["fg_impact"]["mean"] = proj_fg_impact_mean
    proj_category_stats_totals["fg_impact"]["min"] = proj_min_fg_impact
    proj_category_stats_totals["fg_impact"]["max"] = proj_max_fg_impact
    proj_category_stats_totals["ft_impact"]["mean"] = proj_ft_impact_mean
    proj_category_stats_totals["ft_impact"]["min"] = proj_min_ft_impact
    proj_category_stats_totals["ft_impact"]["max"] = proj_max_ft_impact

    (
        proj_category_means_per,
        proj_fg_impact_mean_per,
        proj_min_fg_impact_per,
        proj_max_fg_impact_per,
        proj_ft_impact_mean_per,
        proj_min_ft_impact_per,
        proj_max_ft_impact_per,
    ) = calc_categories(
        proj_players,
        proj_category_sums_per,
        proj_category_sums_per[0] / proj_category_sums_per[1],
        proj_category_sums_per[2] / proj_category_sums_per[3],
        False,
    )
    proj_category_stats_per["fg_impact"]["mean"] = proj_fg_impact_mean_per
    proj_category_stats_per["fg_impact"]["min"] = proj_min_fg_impact_per
    proj_category_stats_per["fg_impact"]["max"] = proj_max_fg_impact_per
    proj_category_stats_per["ft_impact"]["mean"] = proj_ft_impact_mean_per
    proj_category_stats_per["ft_impact"]["min"] = proj_min_ft_impact_per
    proj_category_stats_per["ft_impact"]["max"] = proj_max_ft_impact_per

    (
        past_category_means,
        past_fg_impact_mean,
        past_min_fg_impact,
        past_max_fg_impact,
        past_ft_impact_mean,
        past_min_ft_impact,
        past_max_ft_impact,
    ) = calc_categories(
        past_players,
        past_category_sums_totals,
        past_category_sums_totals[0] / past_category_sums_totals[1],
        past_category_sums_totals[2] / past_category_sums_totals[3],
        True,
    )
    past_category_stats_totals["fg_impact"]["mean"] = past_fg_impact_mean
    past_category_stats_totals["fg_impact"]["min"] = past_min_fg_impact
    past_category_stats_totals["fg_impact"]["max"] = past_max_fg_impact
    past_category_stats_totals["ft_impact"]["mean"] = past_ft_impact_mean
    past_category_stats_totals["ft_impact"]["min"] = past_min_ft_impact
    past_category_stats_totals["ft_impact"]["max"] = past_max_ft_impact

    (
        past_category_means_per,
        past_fg_impact_mean_per,
        past_min_fg_impact_per,
        past_max_fg_impact_per,
        past_ft_impact_mean_per,
        past_min_ft_impact_per,
        past_max_ft_impact_per,
    ) = calc_categories(
        past_players,
        past_category_sums_per,
        past_category_sums_per[0] / past_category_sums_per[1],
        past_category_sums_per[2] / past_category_sums_per[3],
        False,
    )
    past_category_stats_per["fg_impact"]["mean"] = past_fg_impact_mean_per
    past_category_stats_per["fg_impact"]["min"] = past_min_fg_impact_per
    past_category_stats_per["fg_impact"]["max"] = past_max_fg_impact_per
    past_category_stats_per["ft_impact"]["mean"] = past_ft_impact_mean_per
    past_category_stats_per["ft_impact"]["min"] = past_min_ft_impact_per
    past_category_stats_per["ft_impact"]["max"] = past_max_ft_impact_per

    # Update means
    for category, mean in zip(category_keys, proj_category_means):
        proj_category_stats_totals[category]["mean"] = mean
    for category, mean in zip(category_keys, proj_category_means_per):
        proj_category_stats_per[category]["mean"] = mean
    for category, mean in zip(category_keys, past_category_means):
        past_category_stats_totals[category]["mean"] = mean
    for category, mean in zip(category_keys, past_category_means_per):
        past_category_stats_per[category]["mean"] = mean

    # Calculate stds
    proj_category_stds_totals = [0] * 13
    past_category_stds_totals = [0] * 13
    proj_category_stds_per = [0] * 13
    past_category_stds_per = [0] * 13

    for player in proj_players:
        for i, key in enumerate(category_keys):
            gp = player.stats.gp
            proj_category_stds_totals[i] += (
                getattr(player.stats, key) * gp
                - proj_category_stats_totals[key]["mean"]
            ) ** 2
            proj_category_stds_per[i] += (
                getattr(player.stats, key) - proj_category_stats_per[key]["mean"]
            ) ** 2

    for player in past_players:
        for i, key in enumerate(category_keys):
            gp = player.stats.gp
            past_category_stds_totals[i] += (
                getattr(player.stats, key) * gp
                - past_category_stats_totals[key]["mean"]
            ) ** 2
            past_category_stds_per[i] += (
                getattr(player.stats, key) - past_category_stats_per[key]["mean"]
            ) ** 2

    proj_category_stds_totals = [
        ((s / len(proj_players)) ** 0.5) for s in proj_category_stds_totals
    ]
    proj_category_stds_per = [
        ((s / len(proj_players)) ** 0.5) for s in proj_category_stds_per
    ]
    past_category_stds_totals = [
        ((s / len(past_players)) ** 0.5) for s in past_category_stds_totals
    ]
    past_category_stds_per = [
        ((s / len(past_players)) ** 0.5) for s in past_category_stds_per
    ]

    # Update stds
    for category, std in zip(category_keys, proj_category_stds_totals):
        proj_category_stats_totals[category]["std"] = std
    for category, std in zip(category_keys, past_category_stds_totals):
        past_category_stats_totals[category]["std"] = std

    logger.info("=== Writing to data/players.json ===")

    proj_players_data = [player.__dict__ for player in proj_players]
    past_players_data = [player.__dict__ for player in past_players]
    for player in proj_players_data:
        player["stats"] = player["stats"].__dict__
    for player in past_players_data:
        player["stats"] = player["stats"].__dict__
    json_data[proj_year_key] = proj_players_data
    json_data[past_year_key] = past_players_data
    json_data[proj_year_key + "_category_stats_totals"] = proj_category_stats_totals
    json_data[proj_year_key + "_category_stats_per"] = proj_category_stats_per
    json_data[past_year_key + "_category_stats_totals"] = past_category_stats_totals
    json_data[past_year_key + "_category_stats_per"] = past_category_stats_per

    with open("data/players.json", "w") as json_file:
        json.dump(json_data, json_file, indent=2)


if __name__ == "__main__":
    main()
