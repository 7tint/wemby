"use client";

import { Box, Heading } from "@chakra-ui/react";
import RankingsTable from "../../components/RankingsTable";
import { getPlayers } from "../../api/players";
import { useEffect, useState } from "react";
import { Player } from "@/types/playerTypes";
import calculateZScores from "@/data/z_score";

const RankingsPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const getPlayersData = async () => {
      const players: Player[] = await getPlayers();
      const proj_z_scores = calculateZScores(players, false);
      const past_z_scores = calculateZScores(players, true);
      players.forEach((player) => {
        player.projection_z_scores = proj_z_scores.get(player.id) || null;
        player.past_year_z_scores = past_z_scores.get(player.id) || null;
      });
      setPlayers(players);
    };
    getPlayersData();
  }, []);

  console.log(players);

  return (
    <Box>
      <Heading>Rankings</Heading>
      <RankingsTable />
    </Box>
  );
};

export default RankingsPage;
