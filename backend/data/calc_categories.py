def calc_categories(players, category_sums):
    players_count = len(players)
    category_means = [sum / players_count for sum in category_sums]
    fg_impact_sum, ft_impact_sum = 0, 0
    league_avg_fg_pct = category_sums[0] / category_sums[1]
    league_avg_ft_pct = category_sums[2] / category_sums[3]
    min_fg_impact, max_fg_impact = float("inf"), float("-inf")
    min_ft_impact, max_ft_impact = float("inf"), float("-inf")

    for player in players:
        fg_diff = (
            (player.stats.fgm / player.stats.fga - league_avg_fg_pct)
            if player.stats.fga != 0
            else 0
        )
        ft_diff = (
            (player.stats.ftm / player.stats.fta - league_avg_ft_pct)
            if player.stats.fta != 0
            else 0
        )
        player.stats.fg_impact = fg_diff * player.stats.fga
        player.stats.ft_impact = ft_diff * player.stats.fta
        fg_impact_sum += player.stats.fg_impact
        ft_impact_sum += player.stats.ft_impact
        min_fg_impact = min(min_fg_impact, player.stats.fg_impact)
        max_fg_impact = max(max_fg_impact, player.stats.fg_impact)
        min_ft_impact = min(min_ft_impact, player.stats.ft_impact)
        max_ft_impact = max(max_ft_impact, player.stats.ft_impact)

    fg_imp_mean = fg_impact_sum / players_count
    fg_imp_min = min_fg_impact
    fg_imp_max = max_fg_impact

    ft_imp_mean = ft_impact_sum / players_count
    ft_imp_min = min_ft_impact
    ft_imp_max = max_ft_impact

    return (
        category_means,
        fg_imp_mean,
        fg_imp_min,
        fg_imp_max,
        ft_imp_mean,
        ft_imp_min,
        ft_imp_max,
    )
