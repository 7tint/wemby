import { getStats } from "./stats";
import { Player, PlayerStatsNScore } from "@/types/playerTypes";
import { CategoryStats } from "@/types/statTypes";

const calculateZScores = (
  players: Player[],
  categories: CategoryStats
): Map<number, PlayerStatsNScore> => {
  // Games played
  const GP = players.map((player) => getStats(player).gp);

  // Calculate z-scores
  const plainZMap = new Map<number, PlayerStatsNScore>();
  players.forEach((p, i) => {
    const pStats = getStats(p);
    const plainZ = {
      fgImpact:
        (pStats.fgImpact * GP[i] - categories.fgImpact.mean) /
        categories.fgImpact.std,
      ftImpact:
        (pStats.ftImpact * GP[i] - categories.ftImpact.mean) /
        categories.ftImpact.std,
      tpm: (pStats.tpm * GP[i] - categories.tpm.mean) / categories.tpm.std,
      pts: (pStats.pts * GP[i] - categories.pts.mean) / categories.pts.std,
      reb: (pStats.reb * GP[i] - categories.reb.mean) / categories.reb.std,
      ast: (pStats.ast * GP[i] - categories.ast.mean) / categories.ast.std,
      stl: (pStats.stl * GP[i] - categories.stl.mean) / categories.stl.std,
      blk: (pStats.blk * GP[i] - categories.blk.mean) / categories.blk.std,
      to: (categories.to.mean - pStats.to * GP[i]) / categories.to.std,
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
    zScores.set(player.id, PlayerStatsNScore);
  });

  return zScores;
};

export default calculateZScores;
