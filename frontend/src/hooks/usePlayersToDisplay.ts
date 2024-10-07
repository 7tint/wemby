import { totalCategories } from "@/data/stats";
import { Player } from "@/types/playerTypes";
import { EMPTY_PLAYER_STATS_NSCORE } from "@/utils/consts";
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
            if (player.nScores) {
              player.nScores.total = totalCategories(player.nScores, punts);
            } else {
              player.nScores = {
                ...EMPTY_PLAYER_STATS_NSCORE,
                total: totalCategories(EMPTY_PLAYER_STATS_NSCORE, punts),
              };
            }
            return player;
          })
        : [];
    return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, punts, showSmartScores]);
};

export default usePlayersToDisplay;
