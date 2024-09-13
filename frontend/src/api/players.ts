import { Player } from "@/types/playerTypes";
import { CategoryStats, EMPTY_CATEGORY_STATS } from "@/types/statTypes";
import toCamelCase from "@/utils/camelCase";
import { API_URL } from "@/utils/env";

interface PlayerResponse {
  players: Player[];
  projCategories: CategoryStats;
  pastCategories: CategoryStats;
}
const getPlayers = async (): Promise<PlayerResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/players`);
    const data = await response.json();
    const players = toCamelCase(data.players) as Player[];
    const projCategories = toCamelCase(
      data.proj_category_stats
    ) as CategoryStats;
    const pastCategories = toCamelCase(
      data.past_category_stats
    ) as CategoryStats;
    return { players, projCategories, pastCategories };
  } catch (error) {
    console.error("Error fetching players", error);
    return {
      players: [],
      projCategories: EMPTY_CATEGORY_STATS,
      pastCategories: EMPTY_CATEGORY_STATS,
    };
  }
};

export { getPlayers };
