import { sum } from "./math";
import { getStats } from "./stats";
import { Player, PlayerStatsNScore } from "@/types/playerTypes";
import { CategoryStats } from "@/types/statTypes";

/**
 * Calculate min-max normalization for each player
 * This method is a bit inaccurate right now. TODO: Improve algorithm
 */

const calculateMinMax = (
  players: Player[],
  categories: CategoryStats,
  usePastYearStats: boolean
): Map<number, PlayerStatsNScore> => {
  const u = usePastYearStats;
  if (u) players = players.filter((player) => player.pastYearStats);

  // Calculate min-max normalization
  const minMax = new Map<number, PlayerStatsNScore>();
  players.forEach((player) => {
    if (u && !player.pastYearStats) {
      minMax.set(player.id, {
        fgImpact: 0,
        ftImpact: 0,
        tpm: 0,
        pts: 0,
        reb: 0,
        ast: 0,
        stl: 0,
        blk: 0,
        to: 0,
      });
      return;
    }

    const playerStats = getStats(player, u);
    const nScores = new Map<string, number>();
    Object.entries(categories).forEach(([category, stat]) => {
      if (
        category === "fgm" ||
        category === "fga" ||
        category === "ftm" ||
        category === "fta"
      )
        return;

      let min = stat.min,
        max = stat.max;
      if (max === min) return 0;
      if (category !== "fgImpact" && category !== "ftImpact") {
        min = min / 72;
        max = max / 72;
      }

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
