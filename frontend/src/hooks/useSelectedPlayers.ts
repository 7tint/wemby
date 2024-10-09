import { Player } from "@/types/playerTypes";
import { useMemo } from "react";

const useSelectedPlayers = (
  selectedPlayerIds: Record<string, boolean>,
  players: Player[]
) => {
  return useMemo<Set<Player>>(() => {
    return new Set(players.filter((player) => selectedPlayerIds[player.id]));
  }, [selectedPlayerIds, players]);
};

export default useSelectedPlayers;
