import { Player } from "@/types/playerTypes";
import toCamelCase from "@/utils/camelCase";
import { API_URL } from "@/utils/env";

const getPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/api/players`);
    const data = await response.json();
    const players = toCamelCase(data) as Player[];
    return players;
  } catch (error) {
    console.error("Error fetching players", error);
    return [];
  }
};

export { getPlayers };
