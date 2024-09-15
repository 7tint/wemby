import { getNStats, totalCategories } from "@/data/stats";
import { EMPTY_PLAYER_STATS_NSCORE, Player } from "@/types/playerTypes";
import { useMemo } from "react";

const usePlayersToDisplay = (
  players: Player[],
  usePastYearStats: boolean,
  punts: string[]
) => {
  return useMemo<Player[]>(() => {
    const res =
      players.length > 0
        ? players
            .filter((player) => {
              if (usePastYearStats && !player.pastYearRank) return false;
              if (!usePastYearStats && !player.rank) return false;
              return true;
            })
            .map((player) => ({
              ...player,
              projectionNScores: {
                ...getNStats(player, false),
                total: totalCategories(
                  player.projectionNScores
                    ? player.projectionNScores
                    : EMPTY_PLAYER_STATS_NSCORE,
                  punts
                ),
              },
              pastYearNScores: {
                ...getNStats(player, true),
                total: totalCategories(
                  player.pastYearNScores
                    ? player.pastYearNScores
                    : EMPTY_PLAYER_STATS_NSCORE,
                  punts
                ),
              },
            }))
        : [];
    return res;
  }, [players, usePastYearStats, punts]);
};

export default usePlayersToDisplay;
