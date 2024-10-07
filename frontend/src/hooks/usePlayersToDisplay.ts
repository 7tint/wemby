import { totalCategories } from "@/data/stats";
import { Player } from "@/types/playerTypes";
import { useState, useEffect } from "react";

const usePlayersToDisplay = (
  players: Player[],
  punts: Set<string>,
  showSmartScores: boolean
) => {
  const [processedPlayers, setProcessedPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const processPlayers = (players: Player[], punts: Set<string>) => {
        return players.length > 0
          ? players.map((player) => {
              player.nScores.total = totalCategories(player.nScores, punts);
              return player;
            })
          : [];
      };
      setProcessedPlayers(processPlayers(players, punts));
    }, 0);
    return () => clearTimeout(timer);
  }, [players, punts, showSmartScores]);

  return processedPlayers;
};

export default usePlayersToDisplay;
