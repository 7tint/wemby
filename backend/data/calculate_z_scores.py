# Calculating z-scores is moved to the frontend.

# data/players.py:
#       logger.info("=== Calculating Z-Scores ===")
#       z_scores = calculate_z_scores(players)
#       for player in players:
#           player.z_scores = z_scores[player.id]

"""
import numpy as np
from models import PlayerZScores


# Calculates the z-scores based on projections.
# Return a dictionary of z_scores where the key is player_id and the value is a PlayerZScores object.
def calculate_z_scores(players):
    stats = ["fgm", "fga", "ftm", "fta", "tpm", "pts", "reb", "ast", "stl", "blk", "to"]
    projections = {
        stat: [getattr(player.projections, stat) for player in players]
        for stat in stats
    }
    fgm = projections["fgm"]
    fga = projections["fga"]
    ftm = projections["ftm"]
    fta = projections["fta"]
    tpm = projections["tpm"]
    pts = projections["pts"]
    reb = projections["reb"]
    ast = projections["ast"]
    stl = projections["stl"]
    blk = projections["blk"]
    to = projections["to"]

    # For mean & std, only use first 300 players to avoid outliers
    # 300 is a ballpark number for 10 rotation players on 30 teams
    cutoff = len(players) if len(players) < 300 else 300

    means = {
        "fg_pct": sum(fgm[:cutoff]) / sum(fga[:cutoff]),
        "ft_pct": sum(ftm[:cutoff]) / sum(fta[:cutoff]),
        "fga": np.mean(fga[:cutoff]),
        "fta": np.mean(fta[:cutoff]),
        "tpm": np.mean(tpm[:cutoff]),
        "pts": np.mean(pts[:cutoff]),
        "reb": np.mean(reb[:cutoff]),
        "ast": np.mean(ast[:cutoff]),
        "stl": np.mean(stl[:cutoff]),
        "blk": np.mean(blk[:cutoff]),
        "to": np.mean(to[:cutoff]),
    }

    # From https://www.reddit.com/r/fantasybball/comments/71bdq0/how_to_calculate_weighted_zscore_for_fg/
    # 1. Find the league average for percentage (P) (do this by dividing the total makes by the total attempts).
    # 2. For each player, subtract P from their individual field goal percentage (p) - this is the difference for each player (d).
    # 3. For each player, multiply their attempts (a) times d. This is their impact (m).
    # 4. Calculate z-scores for m.
    # d = p - P
    # m = d * a
    # We are calculating z-scores for m.

    # d = p - P
    fg_diff = [player.projections.fg_pct - means["fg_pct"] for player in players]
    ft_diff = [player.projections.ft_pct - means["ft_pct"] for player in players]

    # m = d * a
    fg_impact = [fg_diff[i] * fga[i] for i in range(len(players))]
    ft_impact = [ft_diff[i] * fta[i] for i in range(len(players))]

    means["fg_impact"] = np.mean(fg_impact[:cutoff])
    means["ft_impact"] = np.mean(ft_impact[:cutoff])

    stds = {
        "fg_impact": np.std(fg_impact[:cutoff]),
        "ft_impact": np.std(ft_impact[:cutoff]),
        "tpm": np.std(tpm[:cutoff]),
        "pts": np.std(pts[:cutoff]),
        "reb": np.std(reb[:cutoff]),
        "ast": np.std(ast[:cutoff]),
        "stl": np.std(stl[:cutoff]),
        "blk": np.std(blk[:cutoff]),
        "to": np.std(to[:cutoff]),
    }

    z_scores = {}
    for i, player in enumerate(players):
        z_scores[player.id] = PlayerZScores(
            fg_pct=(fg_impact[i] - means["fg_impact"]) / stds["fg_impact"],
            ft_pct=(ft_impact[i] - means["ft_impact"]) / stds["ft_impact"],
            tpm=((player.projections.tpm - means["tpm"]) / stds["tpm"]),
            pts=((player.projections.pts - means["pts"]) / stds["pts"]),
            reb=((player.projections.reb - means["reb"]) / stds["reb"]),
            ast=((player.projections.ast - means["ast"]) / stds["ast"]),
            stl=((player.projections.stl - means["stl"]) / stds["stl"]),
            blk=((player.projections.blk - means["blk"]) / stds["blk"]),
            to=((means["to"] - player.projections.to) / stds["to"]),
        )

    return z_scores
"""
