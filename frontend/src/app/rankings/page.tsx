"use client";

import { Container, Heading } from "@chakra-ui/react";
import RankingsTable from "../../components/RankingsTable";
import { getPlayers } from "../../api/players";
import { useEffect, useState } from "react";
import { Player } from "@/types/playerTypes";
// import calculateZScores from "@/data/z_score";
// import calculateMinMax from "@/data/minmax";

const RankingsPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const getPlayersData = async () => {
      let players = await getPlayers();
      // calculateMinMax(players, false);
      // const proj_z_scores = calculateZScores(players, false);
      // const past_z_scores = calculateZScores(players, true);
      // players = players.filter((player) => player.past_year_stats);
      // players.forEach((player) => {
      //   player.projection_z_scores = proj_z_scores.get(player.id) || null;
      //   player.past_year_z_scores = past_z_scores.get(player.id) || null;
      // });
      // players = players.sort(
      //   (a, b) =>
      //     (b.past_year_z_scores?.total || 0) -
      //     (a.past_year_z_scores?.total || 0)
      // );
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
