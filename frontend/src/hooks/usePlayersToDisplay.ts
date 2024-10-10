import { useState, useEffect } from "react";
import { getFavouritePlayers } from "@/app/store/players";
import { totalCategories } from "@/data/stats";
import { Player } from "@/types/playerTypes";

const usePlayersToDisplay = (
  players: Player[],
  punts: Set<string>,
  showSmartScores: boolean,
  favouritesOnly: boolean
) => {
  const [computedPlayers, setComputedPlayers] = useState<Player[]>([]);

  useEffect(() => {
    let playersList = players;
    if (favouritesOnly) {
      const favouritePlayers = getFavouritePlayers();
      playersList = players.filter((player) => favouritePlayers.has(player.id));
    }
    const res =
      playersList.length > 0
        ? playersList.map((player) => {
            player.nScores.total = totalCategories(player.nScores, punts);
            return player;
          })
        : [];
    setComputedPlayers(res);
  }, [players, punts, showSmartScores, favouritesOnly]);

  return computedPlayers;
};

export default usePlayersToDisplay;
