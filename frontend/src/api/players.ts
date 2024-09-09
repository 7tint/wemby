import { Player } from "@/types/playerTypes";
import { API_URL } from "@/utils/env";

const getPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/api/players`);
    const players: Player[] = await response.json();
    return players;
  } catch (error) {
    console.error("Error fetching players", error);
    return [];
  }
};

export { getPlayers };
