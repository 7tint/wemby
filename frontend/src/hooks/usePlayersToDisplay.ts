import { getNStats, totalCategories } from "@/data/stats";
import { Player } from "@/types/playerTypes";
import { EMPTY_PLAYER_STATS_NSCORE } from "@/utils/consts";
import { useMemo } from "react";

const usePlayersToDisplay = (
  players: Player[],
  punts: string[],
  showSmartScores: boolean
) => {
  return useMemo<Player[]>(() => {
    const res =
      players.length > 0
        ? players.map((player) => ({
            ...player,
            nScores: {
              ...getNStats(player),
              total: totalCategories(
                player.nScores ? player.nScores : EMPTY_PLAYER_STATS_NSCORE,
                punts
              ),
            },
          }))
        : [];
    return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, punts, showSmartScores]);
};

export default usePlayersToDisplay;
