"use client";

import { Container, Heading } from "@chakra-ui/react";
import RankingsTable from "../../components/RankingsTable";
import { getPlayers } from "../../api/players";
import { useEffect, useState } from "react";
import { Player } from "@/types/playerTypes";
import calculateZScores from "@/data/z_score";

const RankingsPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const getPlayersData = async () => {
      let players = await getPlayers();
      const proj_z_scores = calculateZScores(players, false);
      const past_z_scores = calculateZScores(players, true);
      players.forEach((player) => {
        player.projection_z_scores = proj_z_scores.get(player.id) || null;
        player.past_year_z_scores = past_z_scores.get(player.id) || null;
      });
      players = players.sort(
        (a, b) =>
          (b.projection_z_scores?.total || 0) -
          (a.projection_z_scores?.total || 0)
      );
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
