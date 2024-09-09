import { Player, PlayerZScores } from "@/types/playerTypes";
import { mean, std, sum } from "./math";

export { calculateZScores };

const calculateZScores = (players: Player[]): Map<number, PlayerZScores> => {
  const stats = [
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

  const projections = new Map(
    stats.map((stat) => [
      stat,
      players.map((player) => player.projections[stat]),
    ])
  );

  const fgm = projections.get("fgm")!;
  const fga = projections.get("fga")!;
  const ftm = projections.get("ftm")!;
  const fta = projections.get("fta")!;
  const tpm = projections.get("tpm")!;
  const pts = projections.get("pts")!;
  const reb = projections.get("reb")!;
  const ast = projections.get("ast")!;
  const stl = projections.get("stl")!;
  const blk = projections.get("blk")!;
  const to = projections.get("to")!;

  const cutoff = Math.min(players.length, 300);

  const means = new Map<string, number>([
    ["fg_pct", sum(fgm.slice(0, cutoff)) / sum(fga.slice(0, cutoff))],
    ["ft_pct", sum(ftm.slice(0, cutoff)) / sum(fta.slice(0, cutoff))],
    ["fga", mean(fga.slice(0, cutoff))],
    ["fta", mean(fta.slice(0, cutoff))],
    ["tpm", mean(tpm.slice(0, cutoff))],
    ["pts", mean(pts.slice(0, cutoff))],
    ["reb", mean(reb.slice(0, cutoff))],
    ["ast", mean(ast.slice(0, cutoff))],
    ["stl", mean(stl.slice(0, cutoff))],
    ["blk", mean(blk.slice(0, cutoff))],
    ["to", mean(to.slice(0, cutoff))],
  ]);

  const fg_diff = players.map(
    (player) => player.projections.fg_pct - means.get("fg_pct")!
  );
  const ft_diff = players.map(
    (player) => player.projections.ft_pct - means.get("ft_pct")!
  );

  const fg_impact = fg_diff.map((diff, i) => diff * fga[i]);
  const ft_impact = ft_diff.map((diff, i) => diff * fta[i]);

  means.set("fg_impact", mean(fg_impact.slice(0, cutoff)));
  means.set("ft_impact", mean(ft_impact.slice(0, cutoff)));

  const stds = new Map<string, number>([
    ["fg_impact", std(fg_impact.slice(0, cutoff))],
    ["ft_impact", std(ft_impact.slice(0, cutoff))],
    ["tpm", std(tpm.slice(0, cutoff))],
    ["pts", std(pts.slice(0, cutoff))],
    ["reb", std(reb.slice(0, cutoff))],
    ["ast", std(ast.slice(0, cutoff))],
    ["stl", std(stl.slice(0, cutoff))],
    ["blk", std(blk.slice(0, cutoff))],
    ["to", std(to.slice(0, cutoff))],
  ]);

  const zScores = new Map<number, PlayerZScores>();

  players.forEach((player, i) => {
    zScores.set(player.id, {
      fg_pct: (fg_impact[i] - means.get("fg_impact")!) / stds.get("fg_impact")!,
      ft_pct: (ft_impact[i] - means.get("ft_impact")!) / stds.get("ft_impact")!,
      tpm: (player.projections.tpm - means.get("tpm")!) / stds.get("tpm")!,
      pts: (player.projections.pts - means.get("pts")!) / stds.get("pts")!,
      reb: (player.projections.reb - means.get("reb")!) / stds.get("reb")!,
      ast: (player.projections.ast - means.get("ast")!) / stds.get("ast")!,
      stl: (player.projections.stl - means.get("stl")!) / stds.get("stl")!,
      blk: (player.projections.blk - means.get("blk")!) / stds.get("blk")!,
      to: (means.get("to")! - player.projections.to) / stds.get("to")!,
    });
  });

  return zScores;
};
