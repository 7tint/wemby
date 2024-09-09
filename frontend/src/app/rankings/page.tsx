"use client";

import { Container, Heading } from "@chakra-ui/react";
import RankingsTable from "../../components/RankingsTable";
import { getPlayers } from "../../api/players";
import { useEffect, useState } from "react";
import { Player } from "@/types/playerTypes";
import calculateMinMax from "@/data/minmax";
import calculateZScores from "@/data/z_score";

const RankingsPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const getPlayersData = async () => {
      let players = await getPlayers();
      const zScoresProj = calculateZScores(players, false);
      const minmaxScoresProj = calculateMinMax(players, false);
      const zScoresPast = calculateZScores(players, true);
      const minmaxScoresPast = calculateMinMax(players, true);

      players.forEach((player) => {
        const projZScores = zScoresProj.get(player.id) || null;
        const projMinMax = minmaxScoresProj.get(player.id) || null;
        if (projZScores && projMinMax) {
          player.projectionNScores = {
            fg: 1 * projZScores.fg + 5 * projMinMax.fg,
            ft: 1 * projZScores.ft + 5 * projMinMax.ft,
            tpm: 1 * projZScores.tpm + 5 * projMinMax.tpm,
            pts: 1 * projZScores.pts + 5 * projMinMax.pts,
            reb: 1 * projZScores.reb + 5 * projMinMax.reb,
            ast: 1 * projZScores.ast + 5 * projMinMax.ast,
            stl: 1 * projZScores.stl + 5 * projMinMax.stl,
            blk: 1 * projZScores.blk + 5 * projMinMax.blk,
            to: 1 * projZScores.to + 5 * projMinMax.to,
            total: 1 * projZScores.total + 5 * projMinMax.total,
          };
        }

        const pastZScores = zScoresPast.get(player.id) || null;
        const pastMinMax = minmaxScoresPast.get(player.id) || null;
        if (pastZScores && pastMinMax) {
          player.pastYearNScores = {
            fg: 1 * pastZScores.fg + 5 * pastMinMax.fg,
            ft: 1 * pastZScores.ft + 5 * pastMinMax.ft,
            tpm: 1 * pastZScores.tpm + 5 * pastMinMax.tpm,
            pts: 1 * pastZScores.pts + 5 * pastMinMax.pts,
            reb: 1 * pastZScores.reb + 5 * pastMinMax.reb,
            ast: 1 * pastZScores.ast + 5 * pastMinMax.ast,
            stl: 1 * pastZScores.stl + 5 * pastMinMax.stl,
            blk: 1 * pastZScores.blk + 5 * pastMinMax.blk,
            to: 1 * pastZScores.to + 5 * pastMinMax.to,
            total: 1 * pastZScores.total + 5 * pastMinMax.total,
          };
        } else {
          player.pastYearNScores = null;
        }
      });
      setPlayers(players);
    };
    getPlayersData();
  }, []);

  return (
    <Container maxW="container.xl">
      <Heading>Rankings</Heading>
      <RankingsTable players={players} />
    </Container>
  );
};

export default RankingsPage;
