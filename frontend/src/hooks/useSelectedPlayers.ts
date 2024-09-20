import { Player } from "@/types/playerTypes";
import { useMemo } from "react";

const useSelectedPlayers = (
  selectedPlayerIds: Record<string, boolean>,
  players: Player[]
) => {
  return useMemo<Player[]>(() => {
    return players.filter((player) => selectedPlayerIds[player.id]);
  }, [selectedPlayerIds, players]);
};

export default useSelectedPlayers;
