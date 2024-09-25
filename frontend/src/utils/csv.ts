import { Player } from "@/types/playerTypes";
import { Row } from "@tanstack/react-table";
import { mkConfig, generateCsv, download } from "export-to-csv";

const exportToCsv = (rows: Row<Player>[]) => {
  const csvConfig = mkConfig({
    fieldSeparator: ",",
    filename: "sample", // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const rowData = rows.map((row) => ({
    hashtagRank: row.original.rank,
    firstName: row.original.firstName,
    lastName: row.original.lastName,
    team: row.original.team,
    age: row.original.age,
    positions: row.original.positions.join(", "),
    gamesPlayed: row.original.stats.gp,
    minutesPerGame: row.original.stats.mpg,
    fieldGoalAttempts: row.original.stats.fga,
    fieldGoalMade: row.original.stats.fgm,
    fieldGoalPercent: row.original.stats.fgm / row.original.stats.fga,
    freeThrowAttempts: row.original.stats.fta,
    freeThrowMade: row.original.stats.ftm,
    freeThrowPercent: row.original.stats.ftm / row.original.stats.fta,
    threePointMade: row.original.stats.tpm,
    points: row.original.stats.pts,
    rebounds: row.original.stats.reb,
    assists: row.original.stats.ast,
    steals: row.original.stats.stl,
    blocks: row.original.stats.blk,
    turnovers: row.original.stats.to,
    fieldGoalSmartScore: row.original.nScores.fgImpact,
    freeThrowSmartScore: row.original.nScores.ftImpact,
    threePointSmartScore: row.original.nScores.tpm,
    pointsSmartScore: row.original.nScores.pts,
    reboundsSmartScore: row.original.nScores.reb,
    assistsSmartScore: row.original.nScores.ast,
    stealsSmartScore: row.original.nScores.stl,
    blocksSmartScore: row.original.nScores.blk,
    turnoversSmartScore: row.original.nScores.to,
    totalSmartScore: row.original.nScores.total,
    auctionValue: row.original.auctionValuedAt,
    hashtagAuctionValue: row.original.auctionHashtag,
    espnAuctionValue: row.original.auctionEspnAvg,
    yahooAuctionValue: row.original.auctionYahooAvg,
  }));
  const csv = generateCsv(csvConfig)(rowData);
  download(csvConfig)(csv);
};

export default exportToCsv;
