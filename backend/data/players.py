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


def main():
    logger.info("=== Getting ESPN Roster Data ===")
    players_roster_data = get_rosters()  # ESPN Roster Data

    logger.info("=== Getting Hashtag Projections Data ===")
    players_projections = scrape_projections()  # Hashtag Projections

    logger.info("=== Getting Hashtag Past Year Data ===")
    players_past_year_stats = scrape_past_year_stats()  # Hashtag Past Year Stats

    logger.info("=== Getting Hashtag Auction Data ===")
    players_auction_data = scrape_auction_data()  # Hashtag Auction Data

    json_data = {}

    # Sums for calculating means
    proj_category_sums = [0] * 11
    past_category_sums = [0] * 11

    # Min and Max for each category
    proj_category_stats = {}
    past_category_stats = {}

    proj_players_count = 0
    past_players_count = 0
    for key in category_keys:
        proj_category_stats[key] = {
            "min": float("inf"),
            "max": float("-inf"),
        }
        past_category_stats[key] = {
            "min": float("inf"),
            "max": float("-inf"),
        }

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
            # logging.info(f"Attemping to find roster data for player: {name}")

            # Check in name exception list
            if name in [exception[0] for exception in name_exceptions]:
                new_name = next(
                    exception[1]
                    for exception in name_exceptions
                    if exception[0] == name
                )
                if new_name == "SKIP":
                    logger.error(f"Manually skipping player: {name}")
                    continue

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
            past_year_team=past_year_stats["team"] if past_year_stats else None,
            age=roster_data["age"],
            headshot=roster_data["headshot"],
            years_pro=roster_data["years_pro"],
            jersey=roster_data["jersey"],
            rank=projections["rank"],
            past_year_rank=past_year_stats["rank"] if past_year_stats else None,
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

        # Update sums, sums of squares, and min/max for each category
        proj_players_count += 1
        for i, key in enumerate(category_keys):
            if key == "fg_impact" or key == "ft_impact":
                continue
            proj_category_sums[i] += (
                getattr(player.projections, key) * player.projections.gp
            )
            proj_category_stats[key]["min"] = min(
                proj_category_stats[key]["min"],
                getattr(player.projections, key) * player.projections.gp,
            )
            proj_category_stats[key]["max"] = max(
                proj_category_stats[key]["max"],
                getattr(player.projections, key) * player.projections.gp,
            )

        if player.past_year_stats:
            past_players_count += 1
            for i, key in enumerate(category_keys):
                if key == "fg_impact" or key == "ft_impact":
                    continue
                past_category_sums[i] += (
                    getattr(player.past_year_stats, key) * player.projections.gp
                )
                past_category_stats[key]["min"] = min(
                    past_category_stats[key]["min"],
                    getattr(player.past_year_stats, key) * player.past_year_stats.gp,
                )
                past_category_stats[key]["max"] = max(
                    past_category_stats[key]["max"],
                    getattr(player.past_year_stats, key) * player.past_year_stats.gp,
                )

        players.append(player)

    proj_category_means = [sum / proj_players_count for sum in proj_category_sums]
    past_category_means = [sum / past_players_count for sum in past_category_sums]

    # Calculate FG Impact and FT Impact
    proj_fg_impact_sum, proj_ft_impact_sum = 0, 0
    past_fg_impact_sum, past_ft_impact_sum = 0, 0
    proj_league_avg_fg_pct = proj_category_sums[0] / proj_category_sums[1]
    proj_league_avg_ft_pct = proj_category_sums[2] / proj_category_sums[3]
    past_league_avg_fg_pct = past_category_sums[0] / past_category_sums[1]
    past_league_avg_ft_pct = past_category_sums[2] / past_category_sums[3]
    proj_min_fg_impact, proj_max_fg_impact = float("inf"), float("-inf")
    proj_min_ft_impact, proj_max_ft_impact = float("inf"), float("-inf")
    past_min_fg_impact, past_max_fg_impact = float("inf"), float("-inf")
    past_min_ft_impact, past_max_ft_impact = float("inf"), float("-inf")

    for player in players:
        proj_fg_diff = (
            (player.projections.fgm / player.projections.fga - proj_league_avg_fg_pct)
            if player.projections.fga != 0
            else 0
        )
        proj_ft_diff = (
            (player.projections.ftm / player.projections.fta - proj_league_avg_ft_pct)
            if player.projections.fta != 0
            else 0
        )
        player.projections.fg_impact = proj_fg_diff * player.projections.fga
        player.projections.ft_impact = proj_ft_diff * player.projections.fta
        proj_fg_impact_sum += player.projections.fg_impact
        proj_ft_impact_sum += player.projections.ft_impact
        proj_min_fg_impact = min(proj_min_fg_impact, player.projections.fg_impact)
        proj_max_fg_impact = max(proj_max_fg_impact, player.projections.fg_impact)
        proj_min_ft_impact = min(proj_min_ft_impact, player.projections.ft_impact)
        proj_max_ft_impact = max(proj_max_ft_impact, player.projections.ft_impact)

        if player.past_year_stats:
            past_fg_diff = (
                (player.past_year_stats.fgm / player.past_year_stats.fga)
                - past_league_avg_fg_pct
                if player.past_year_stats.fga != 0
                else 0
            )
            past_ft_diff = (
                (player.past_year_stats.ftm / player.past_year_stats.fta)
                - past_league_avg_ft_pct
                if player.past_year_stats.fta != 0
                else 0
            )
            player.past_year_stats.fg_impact = past_fg_diff * player.past_year_stats.fga
            player.past_year_stats.ft_impact = past_ft_diff * player.past_year_stats.fta
            past_fg_impact_sum += player.past_year_stats.fg_impact
            past_ft_impact_sum += player.past_year_stats.ft_impact
            past_min_fg_impact = min(past_min_fg_impact, player.projections.fg_impact)
            past_max_fg_impact = max(past_max_fg_impact, player.projections.fg_impact)
            past_min_ft_impact = min(past_min_ft_impact, player.projections.ft_impact)
            past_max_ft_impact = max(past_max_ft_impact, player.projections.ft_impact)

    proj_category_stats["fg_impact"]["mean"] = proj_fg_impact_sum / proj_players_count
    proj_category_stats["fg_impact"]["min"] = proj_min_fg_impact
    proj_category_stats["fg_impact"]["max"] = proj_max_fg_impact

    proj_category_stats["ft_impact"]["mean"] = proj_ft_impact_sum / proj_players_count
    proj_category_stats["ft_impact"]["min"] = proj_min_ft_impact
    proj_category_stats["ft_impact"]["max"] = proj_max_ft_impact

    past_category_stats["fg_impact"]["mean"] = past_fg_impact_sum / past_players_count
    past_category_stats["fg_impact"]["min"] = past_min_fg_impact
    past_category_stats["fg_impact"]["max"] = past_max_fg_impact

    past_category_stats["ft_impact"]["mean"] = past_ft_impact_sum / past_players_count
    past_category_stats["ft_impact"]["min"] = past_min_ft_impact
    past_category_stats["ft_impact"]["max"] = past_max_ft_impact

    # Update means
    for category, mean in zip(category_keys, proj_category_means):
        proj_category_stats[category]["mean"] = mean
    for category, mean in zip(category_keys, past_category_means):
        past_category_stats[category]["mean"] = mean

    # Calculate stds
    proj_category_stds = [0] * 13
    past_category_stds = [0] * 13

    for player in players:
        for i, key in enumerate(category_keys):
            gp = player.projections.gp
            if key == "fg_impact" or key == "ft_impact":
                gp = 1
            proj_category_stds[i] += (
                getattr(player.projections, key) * gp - proj_category_stats[key]["mean"]
            ) ** 2
        if not player.past_year_stats:
            continue
        for i, key in enumerate(category_keys):
            gp = player.past_year_stats.gp
            if key == "fg_impact" or key == "ft_impact":
                gp = 1
            past_category_stds[i] += (
                getattr(player.past_year_stats, key) * gp
                - past_category_stats[key]["mean"]
            ) ** 2
    proj_category_stds = [((s / proj_players_count) ** 0.5) for s in proj_category_stds]
    past_category_stds = [((s / past_players_count) ** 0.5) for s in past_category_stds]

    # Update stds
    for category, std in zip(category_keys, proj_category_stds):
        proj_category_stats[category]["std"] = std
    for category, std in zip(category_keys, past_category_stds):
        past_category_stats[category]["std"] = std

    logger.info("=== Writing to data/players.json ===")

    players_data = [player.__dict__ for player in players]
    for player in players_data:
        player["projections"] = player["projections"].__dict__
        player["past_year_stats"] = (
            player["past_year_stats"].__dict__ if player["past_year_stats"] else None
        )
    json_data["players"] = players_data
    json_data["proj_category_stats"] = proj_category_stats
    json_data["past_category_stats"] = past_category_stats

    with open("data/players.json", "w") as json_file:
        json.dump(json_data, json_file, indent=2)


if __name__ == "__main__":
    main()
