import { getStats } from "./stats";
import { Player, PlayerStatsNScore } from "@/types/playerTypes";
import { CategoryStats } from "@/types/statTypes";
import { EMPTY_PLAYER_STATS_NSCORE } from "@/utils/consts";

/**
 * Calculate min-max normalization for each player
 * This method is a bit inaccurate right now. TODO: Improve algorithm
 */

const calculateMinMax = (
  players: Player[],
  categories: CategoryStats
): Map<number, PlayerStatsNScore> => {
  // Calculate min-max normalization
  const minMax = new Map<number, PlayerStatsNScore>();
  players.forEach((player) => {
    if (!player.stats) {
      minMax.set(player.id, EMPTY_PLAYER_STATS_NSCORE);
      return;
    }

    const playerStats = getStats(player);
    const nScores = new Map<string, number>();
    Object.entries(categories).forEach(([category, stat]) => {
      if (
        category === "fgm" ||
        category === "fga" ||
        category === "ftm" ||
        category === "fta"
      )
        return;

      const min = stat.min;
      const max = stat.max;
      if (max === min) return 0;

      const pStat = playerStats[category as keyof typeof playerStats];
      if (category === "to")
        nScores.set(
          category,
          (1 - 2 * ((playerStats.to - min) / (max - min))) * 0.25
        );
      else nScores.set(category, (2 * (pStat - min)) / (max - min) - 1);
    });

    // TODO: Let user choose weights
    minMax.set(player.id, {
      fgImpact: nScores.get("fgImpact") || 0,
      ftImpact: nScores.get("ftImpact") || 0,
      tpm: nScores.get("tpm") || 0,
      pts: nScores.get("pts") || 0,
      reb: nScores.get("reb") || 0,
      ast: nScores.get("ast") || 0,
      stl: nScores.get("stl") || 0,
      blk: nScores.get("blk") || 0,
      to: nScores.get("to") || 0,
    });
  });

  return minMax;
};

export default calculateMinMax;
