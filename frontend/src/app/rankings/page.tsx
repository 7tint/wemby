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
            fg: 1.2 * projZScores.fg + 3 * projMinMax.fg,
            ft: 1.2 * projZScores.ft + 3 * projMinMax.ft,
            tpm: 1.2 * projZScores.tpm + 3 * projMinMax.tpm,
            pts: 1.2 * projZScores.pts + 3 * projMinMax.pts,
            reb: 1.2 * projZScores.reb + 3 * projMinMax.reb,
            ast: 1.2 * projZScores.ast + 3 * projMinMax.ast,
            stl: 1.2 * projZScores.stl + 3 * projMinMax.stl,
            blk: 1.2 * projZScores.blk + 3 * projMinMax.blk,
            to: 1.2 * projZScores.to + 3 * projMinMax.to,
            total: 1.2 * projZScores.total + 3 * projMinMax.total,
          };
        }

        const pastZScores = zScoresPast.get(player.id) || null;
        const pastMinMax = minmaxScoresPast.get(player.id) || null;
        if (pastZScores && pastMinMax) {
          player.pastYearNScores = {
            fg: 1.2 * pastZScores.fg + 3 * pastMinMax.fg,
            ft: 1.2 * pastZScores.ft + 3 * pastMinMax.ft,
            tpm: 1.2 * pastZScores.tpm + 3 * pastMinMax.tpm,
            pts: 1.2 * pastZScores.pts + 3 * pastMinMax.pts,
            reb: 1.2 * pastZScores.reb + 3 * pastMinMax.reb,
            ast: 1.2 * pastZScores.ast + 3 * pastMinMax.ast,
            stl: 1.2 * pastZScores.stl + 3 * pastMinMax.stl,
            blk: 1.2 * pastZScores.blk + 3 * pastMinMax.blk,
            to: 1.2 * pastZScores.to + 3 * pastMinMax.to,
            total: 1.2 * pastZScores.total + 3 * pastMinMax.total,
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
