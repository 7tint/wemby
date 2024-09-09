import { Player, PlayerStats, PlayerStatsNScore } from "@/types/playerTypes";
import { sum } from "./math";
import { CATEGORIES, getStats, MIN_MINUTES } from "./const";

const calculateMinMax = (
  players: Player[],
  usePastYearStats: boolean
): Map<number, PlayerStatsNScore> => {
  const u = usePastYearStats;
  if (u) players = players.filter((player) => player.pastYearStats);

  // Games played factor
  const GP = players.map((player) => getStats(player, u).gp || 0);

  // Array of index of players with MPG > MIN_MINUTES
  const filterIndexes = players
    .map((p, index) => (getStats(p, u).mpg > MIN_MINUTES ? index : -1))
    .filter((index) => index !== -1);

  // Organize stats by category
  const stats = CATEGORIES.map((category) => {
    if (
      category === "fgm" ||
      category === "fga" ||
      category === "ftm" ||
      category === "fta"
    ) {
      return players.map((player, i) => getStats(player, u)[category]);
    } else
      return players.map((player, i) => getStats(player, u)[category] * GP[i]);
  });
  const filteredStats = stats.map((stat) =>
    stat.filter((_, i) => filterIndexes.includes(i))
  );
  const [fgm, fga, ftm, fta, tpm, pts, reb, ast, stl, blk, to] = stats;
  const [fgmF, fgaF, ftmF, ftaF, tpmF, ptsF, rebF, astF, stlF, blkF, toF] =
    filteredStats;

  // For FG% and FT%, first find the "imapct" rating
  const fgMean = sum(fgmF) / sum(fgaF);
  const ftMean = sum(ftmF) / sum(ftaF);
  const fgDiff = players.map((p) => getStats(p, u).fgPct - fgMean);
  const ftDiff = players.map((p) => getStats(p, u).ftPct - ftMean);
  const fgImpact = fgDiff.map((diff, i) => diff * fga[i]);
  const ftImpact = ftDiff.map((diff, i) => diff * fta[i]);

  // Calculate mins and max for each stat
  const mins = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const maxs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  players.forEach((player, i) => {
    if (!filterIndexes.includes(i)) return;

    const playerStats = getStats(player, u);
    CATEGORIES.forEach((category, i) => {
      mins[i] = Math.min(mins[i], playerStats[category] * GP[i]);
      maxs[i] = Math.max(maxs[i], playerStats[category] * GP[i]);
    });
    mins[11] = Math.min(mins[11], fgImpact[i]);
    maxs[11] = Math.max(maxs[11], fgImpact[i]);
    mins[12] = Math.min(mins[12], ftImpact[i]);
    maxs[12] = Math.max(maxs[12], ftImpact[i]);
  });

  // Calculate min-max normalization
  const minMax = new Map<number, PlayerStatsNScore>();
  players.forEach((player, i) => {
    if (u && !player.pastYearStats) {
      minMax.set(player.id, {
        fg: 0,
        ft: 0,
        tpm: 0,
        pts: 0,
        reb: 0,
        ast: 0,
        stl: 0,
        blk: 0,
        to: 0,
        total: 0,
      });
      return;
    }

    const playerStats = getStats(player, u);
    const normalizedStats = CATEGORIES.map((category, i) => {
      const min = mins[i];
      const max = maxs[i];
      if (max === min) return 0;
      return 2 * ((playerStats[category] * GP[i] - min) / (max - min)) - 1;
    });

    const nScores = {
      fg:
        maxs[12] === mins[12]
          ? 0
          : (2 * ((fgImpact[i] - mins[11]) / (maxs[11] - mins[11])) - 1) * 1,
      ft:
        maxs[12] === mins[12]
          ? 0
          : (2 * ((ftImpact[i] - mins[12]) / (maxs[12] - mins[12])) - 1) * 1,
      tpm: normalizedStats[4] * 1,
      pts: normalizedStats[5] * 1,
      reb: normalizedStats[6] * 1,
      ast: normalizedStats[7] * 1,
      stl: normalizedStats[8] * 1,
      blk: normalizedStats[9] * 1,
      to:
        maxs[10] === mins[10]
          ? 0
          : (1 - 2 * ((playerStats.to - mins[10]) / (maxs[10] - mins[10]))) *
            0.75,
    };

    const total = sum(Object.values(nScores));
    minMax.set(player.id, { ...nScores, total });
  });

  return minMax;
};

export default calculateMinMax;
