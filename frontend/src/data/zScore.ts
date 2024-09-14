import { sum } from "./math";
import { getStats } from "./stats";
import { Player, PlayerStatsNScore } from "@/types/playerTypes";
import { CategoryStats } from "@/types/statTypes";

const calculateZScores = (
  players: Player[],
  categories: CategoryStats,
  usePastYearStats: boolean
): Map<number, PlayerStatsNScore> => {
  const u = usePastYearStats;
  if (u) players = players.filter((player) => player.pastYearStats);

  // Games played
  const GP = players.map((player) => getStats(player, u).gp || 0);

  // Calculate z-scores
  const plainZMap = new Map<number, PlayerStatsNScore>();
  players.forEach((p, i) => {
    const pStats = getStats(p, u);
    const plainZ = {
      fgImpact:
        (pStats.fgImpact - categories.fgImpact.mean) / categories.fgImpact.std,
      ftImpact:
        (pStats.ftImpact - categories.ftImpact.mean) / categories.ftImpact.std,
      tpm: (pStats.tpm * GP[i] - categories.tpm.mean) / categories.tpm.std,
      pts: (pStats.pts * GP[i] - categories.pts.mean) / categories.pts.std,
      reb: (pStats.reb * GP[i] - categories.reb.mean) / categories.reb.std,
      ast: (pStats.ast * GP[i] - categories.ast.mean) / categories.ast.std,
      stl: (pStats.stl * GP[i] - categories.stl.mean) / categories.stl.std,
      blk: (pStats.blk * GP[i] - categories.blk.mean) / categories.blk.std,
      to: (categories.to.mean - pStats.to * GP[i]) / categories.to.std,
      total: 0,
    };
    plainZMap.set(p.id, plainZ);
  });

  // Add weights if needed
  // TODO: Let user choose weights
  const zScores = new Map<number, PlayerStatsNScore>();
  players.forEach((player) => {
    const PlayerStatsNScore = {
      fgImpact: plainZMap.get(player.id)!.fgImpact,
      ftImpact: plainZMap.get(player.id)!.ftImpact,
      tpm: plainZMap.get(player.id)!.tpm,
      pts: plainZMap.get(player.id)!.pts,
      reb: plainZMap.get(player.id)!.reb,
      ast: plainZMap.get(player.id)!.ast,
      stl: plainZMap.get(player.id)!.stl,
      blk: plainZMap.get(player.id)!.blk,
      to: plainZMap.get(player.id)!.to,
    };
    const total = sum(Object.values(PlayerStatsNScore));
    zScores.set(player.id, {
      ...PlayerStatsNScore,
      total: total,
    });
  });

  return zScores;
};

export default calculateZScores;
