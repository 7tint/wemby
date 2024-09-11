import { Player, PlayerStatsNScore } from "@/types/playerTypes";
import { mean, std, sum } from "./math";
import { getStats } from "./const";

const CATEGORIES = [
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
] as const;

const MIN_MINUTES = 20;

const calculateZScores = (
  players: Player[],
  usePastYearStats: boolean
): Map<number, PlayerStatsNScore> => {
  const u = usePastYearStats;
  if (u) players = players.filter((player) => player.pastYearStats);

  // Games played
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
      return players.map((player) => getStats(player, u)[category]);
    } else
      return players.map((player, i) => getStats(player, u)[category] * GP[i]);
  });
  const filteredStats = stats.map((stat) =>
    stat.filter((_, i) => filterIndexes.includes(i))
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fgm, fga, ftm, fta, tpm, pts, reb, ast, stl, blk, to] = stats;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fgmF, fgaF, ftmF, ftaF, tpmF, ptsF, rebF, astF, stlF, blkF, toF] =
    filteredStats;

  // Calculate means
  const means = new Map<string, number>([
    ["fg", sum(fgm) / sum(fga)],
    ["ft", sum(ftm) / sum(fta)],
    ["fga", mean(fga)],
    ["fta", mean(fta)],
    ["tpm", mean(tpm)],
    ["pts", mean(pts)],
    ["reb", mean(reb)],
    ["ast", mean(ast)],
    ["stl", mean(stl)],
    ["blk", mean(blk)],
    ["to", mean(to)],
  ]);

  // For FG% and FT%, first find the "imapct" rating
  const fgMean = sum(fgmF) / sum(fgaF);
  const ftMean = sum(ftmF) / sum(ftaF);
  const fgDiff = players.map((p) => getStats(p, u).fgPct - fgMean);
  const ftDiff = players.map((p) => getStats(p, u).ftPct - ftMean);
  const fgImpact = fgDiff.map((diff, i) => diff * fga[i]);
  const ftImpact = ftDiff.map((diff, i) => diff * fta[i]);
  const fgImpactMean = mean(fgImpact);
  const ftImpactMean = mean(ftImpact);

  // Calculate standard deviations
  const stds = new Map<string, number>([
    ["fg", std(fgImpact)],
    ["ft", std(ftImpact)],
    ["tpm", std(tpm)],
    ["pts", std(pts)],
    ["reb", std(reb)],
    ["ast", std(ast)],
    ["stl", std(stl)],
    ["blk", std(blk)],
    ["to", std(to)],
  ]);

  // Calculate z-scores
  const plainZMap = new Map<number, PlayerStatsNScore>();
  players.forEach((p, i) => {
    const plainZ = {
      fg: (fgImpact[i] - fgImpactMean) / stds.get("fg")!,
      ft: (ftImpact[i] - ftImpactMean) / stds.get("ft")!,
      tpm: (getStats(p, u).tpm * GP[i] - means.get("tpm")!) / stds.get("tpm")!,
      pts: (getStats(p, u).pts * GP[i] - means.get("pts")!) / stds.get("pts")!,
      reb: (getStats(p, u).reb * GP[i] - means.get("reb")!) / stds.get("reb")!,
      ast: (getStats(p, u).ast * GP[i] - means.get("ast")!) / stds.get("ast")!,
      stl: (getStats(p, u).stl * GP[i] - means.get("stl")!) / stds.get("stl")!,
      blk: (getStats(p, u).blk * GP[i] - means.get("blk")!) / stds.get("blk")!,
      to: (means.get("to")! - getStats(p, u).to * GP[i]) / stds.get("to")!,
      total: 0,
    };
    plainZMap.set(p.id, plainZ);
  });

  // Add weights if needed
  const zScores = new Map<number, PlayerStatsNScore>();
  players.forEach((player) => {
    const PlayerStatsNScore = {
      fg: plainZMap.get(player.id)!.fg * 1,
      ft: plainZMap.get(player.id)!.ft * 1,
      tpm: plainZMap.get(player.id)!.tpm * 1,
      pts: plainZMap.get(player.id)!.pts * 1,
      reb: plainZMap.get(player.id)!.reb * 1,
      ast: plainZMap.get(player.id)!.ast * 1,
      stl: plainZMap.get(player.id)!.stl * 1,
      blk: plainZMap.get(player.id)!.blk * 1,
      to: plainZMap.get(player.id)!.to * 0.75,
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
