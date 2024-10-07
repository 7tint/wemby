import { totalCategories } from "@/data/stats";
import { Player } from "@/types/playerTypes";
import { useMemo } from "react";

const usePlayersToDisplay = (
  players: Player[],
  punts: Set<string>,
  showSmartScores: boolean
) => {
  return useMemo<Player[]>(() => {
    const res =
      players.length > 0
        ? players.map((player) => {
            player.nScores.total = totalCategories(player.nScores, punts);
            return player;
          })
        : [];
    return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, punts, showSmartScores]);
};

export default usePlayersToDisplay;
