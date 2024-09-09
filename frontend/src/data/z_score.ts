import { Player, PlayerStats, PlayerZScores } from "@/types/playerTypes";
import { mean, std, sum } from "./math";

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

const calculateZScores = (
  players: Player[],
  usePastYearStats: boolean
): Map<number, PlayerZScores> => {
  const getStats = (player: Player): PlayerStats =>
    usePastYearStats ? player.past_year_stats! : player.projections;

  // Exclude player ids for which we don't have past year stats
  if (usePastYearStats) {
    players = players.filter((player) => player.past_year_stats);
  }

  // Only use players who averaged more than 20mpg for calculations
  players = players.filter((player) => getStats(player).mpg > 20);

  const stats = new Map(
    CATEGORIES.map((category) => [
      category,
      players.map((player) => getStats(player)[category]),
    ])
  );
  const fgm = stats.get("fgm")!;
  const fga = stats.get("fga")!;
  const ftm = stats.get("ftm")!;
  const fta = stats.get("fta")!;
  const tpm = stats.get("tpm")!;
  const pts = stats.get("pts")!;
  const reb = stats.get("reb")!;
  const ast = stats.get("ast")!;
  const stl = stats.get("stl")!;
  const blk = stats.get("blk")!;
  const to = stats.get("to")!;

  // 1. Calculate means
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

  // Means for FG% and FT% are weighted by FGA and FTA
  const fg_diff = players.map(
    (player) => getStats(player).fg_pct - means.get("fg")!
  );
  const ft_diff = players.map(
    (player) => getStats(player).ft_pct - means.get("ft")!
  );
  const fg_impact = fg_diff.map((diff, i) => diff * fga[i]);
  const ft_impact = ft_diff.map((diff, i) => diff * fta[i]);
  means.set("fg_impact", mean(fg_impact));
  means.set("ft_impact", mean(ft_impact));

  // 2. Calculate standard deviations
  const stds = new Map<string, number>([
    ["fg", std(fg_impact)],
    ["ft", std(ft_impact)],
    ["tpm", std(tpm)],
    ["pts", std(pts)],
    ["reb", std(reb)],
    ["ast", std(ast)],
    ["stl", std(stl)],
    ["blk", std(blk)],
    ["to", std(to)],
  ]);

  // 3. Calculate z-scores
  const plainZMap = new Map<number, PlayerZScores>();
  const maxes = new Map<string, number>([
    ["fg", 0],
    ["ft", 0],
    ["tpm", 0],
    ["pts", 0],
    ["reb", 0],
    ["ast", 0],
    ["stl", 0],
    ["blk", 0],
    ["to", 0],
  ]);

  players.forEach((player, i) => {
    const plainZ = {
      fg: (fg_impact[i] - means.get("fg_impact")!) / stds.get("fg")!,
      ft: (ft_impact[i] - means.get("ft_impact")!) / stds.get("ft")!,
      tpm: (player.projections.tpm - means.get("tpm")!) / stds.get("tpm")!,
      pts: (player.projections.pts - means.get("pts")!) / stds.get("pts")!,
      reb: (player.projections.reb - means.get("reb")!) / stds.get("reb")!,
      ast: (player.projections.ast - means.get("ast")!) / stds.get("ast")!,
      stl: (player.projections.stl - means.get("stl")!) / stds.get("stl")!,
      blk: (player.projections.blk - means.get("blk")!) / stds.get("blk")!,
      to: (means.get("to")! - player.projections.to) / stds.get("to")!,
      total: 0,
    };
    plainZMap.set(player.id, plainZ);

    maxes.set("fg", Math.max(maxes.get("fg")!, Math.abs(plainZ.fg)));
    maxes.set("ft", Math.max(maxes.get("ft")!, Math.abs(plainZ.ft)));
    maxes.set("tpm", Math.max(maxes.get("tpm")!, Math.abs(plainZ.tpm)));
    maxes.set("pts", Math.max(maxes.get("pts")!, Math.abs(plainZ.pts)));
    maxes.set("reb", Math.max(maxes.get("reb")!, Math.abs(plainZ.reb)));
    maxes.set("ast", Math.max(maxes.get("ast")!, Math.abs(plainZ.ast)));
    maxes.set("stl", Math.max(maxes.get("stl")!, Math.abs(plainZ.stl)));
    maxes.set("blk", Math.max(maxes.get("blk")!, Math.abs(plainZ.blk)));
    maxes.set("to", Math.max(maxes.get("to")!, Math.abs(plainZ.to)));
  });

  const zScores = new Map<number, PlayerZScores>();
  players.forEach((player) => {
    const playerZScores = {
      fg: plainZMap.get(player.id)!.fg / (maxes.get("fg")! / 5),
      ft: plainZMap.get(player.id)!.ft / (maxes.get("ft")! / 5),
      tpm: plainZMap.get(player.id)!.tpm / (maxes.get("tpm")! / 5),
      pts: plainZMap.get(player.id)!.pts / (maxes.get("pts")! / 5),
      reb: plainZMap.get(player.id)!.reb / (maxes.get("reb")! / 5),
      ast: plainZMap.get(player.id)!.ast / (maxes.get("ast")! / 5),
      stl: plainZMap.get(player.id)!.stl / (maxes.get("stl")! / 5),
      blk: plainZMap.get(player.id)!.blk / (maxes.get("blk")! / 5),
      to: plainZMap.get(player.id)!.to / (maxes.get("to")! / 3),
      total: 0,
    };
    playerZScores.total = sum(Object.values(playerZScores));
    zScores.set(player.id, {
      ...playerZScores,
      total: sum(Object.values(playerZScores)),
    });
  });

  return zScores;
};

export default calculateZScores;
