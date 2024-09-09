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

  const means = new Map<string, number>([
    ["fg_pct", sum(fgm) / sum(fga)],
    ["ft_pct", sum(ftm) / sum(fta)],
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
    (player) => getStats(player).fg_pct - means.get("fg_pct")!
  );
  const ft_diff = players.map(
    (player) => getStats(player).ft_pct - means.get("ft_pct")!
  );
  const fg_impact = fg_diff.map((diff, i) => diff * fga[i]);
  const ft_impact = ft_diff.map((diff, i) => diff * fta[i]);
  means.set("fg_impact", mean(fg_impact));
  means.set("ft_impact", mean(ft_impact));

  const stds = new Map<string, number>([
    ["fg_impact", std(fg_impact)],
    ["ft_impact", std(ft_impact)],
    ["tpm", std(tpm)],
    ["pts", std(pts)],
    ["reb", std(reb)],
    ["ast", std(ast)],
    ["stl", std(stl)],
    ["blk", std(blk)],
    ["to", std(to)],
  ]);

  const zScores = new Map<number, PlayerZScores>();

  players.forEach((player, i) => {
    const playerZScores = {
      fg_pct: (fg_impact[i] - means.get("fg_impact")!) / stds.get("fg_impact")!,
      ft_pct: (ft_impact[i] - means.get("ft_impact")!) / stds.get("ft_impact")!,
      tpm: (player.projections.tpm - means.get("tpm")!) / stds.get("tpm")!,
      pts: (player.projections.pts - means.get("pts")!) / stds.get("pts")!,
      reb: (player.projections.reb - means.get("reb")!) / stds.get("reb")!,
      ast: (player.projections.ast - means.get("ast")!) / stds.get("ast")!,
      stl: (player.projections.stl - means.get("stl")!) / stds.get("stl")!,
      blk: (player.projections.blk - means.get("blk")!) / stds.get("blk")!,
      to: (means.get("to")! - player.projections.to) / stds.get("to")!,
    };

    zScores.set(player.id, {
      ...playerZScores,
      total: sum(Object.values(playerZScores)),
    });
  });

  return zScores;
};

export default calculateZScores;
