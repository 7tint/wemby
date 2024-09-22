import { Player } from "@/types/playerTypes";
import { CategoryStats } from "@/types/statTypes";
import toCamelCase from "@/utils/camelCase";
import { EMPTY_CATEGORY_STATS } from "@/utils/consts";
import { API_URL } from "@/utils/env";

interface PlayerResponse {
  year: string;
  players: Player[];
  categoryStatsPer: CategoryStats;
  categoryStatsTotal: CategoryStats;
}

const AVAILABLE_YEARS = ["2023", "2024"];

const getPlayers = async (year: string): Promise<PlayerResponse> => {
  try {
    if (!AVAILABLE_YEARS.includes(year))
      throw new Error("Invalid year provided");
    const response = await fetch(`${API_URL}/api/players/${year}`);
    const data = await response.json();
    const players = toCamelCase(data[`${year}_players`]) as Player[];
    const categoryStatsPer = toCamelCase(
      data[`${year}_category_stats_per`]
    ) as CategoryStats;
    const categoryStatsTotal = toCamelCase(
      data[`${year}_category_stats_total`]
    ) as CategoryStats;

    console.log(players);

    return { year, players, categoryStatsPer, categoryStatsTotal };
  } catch (error) {
    console.error("Error fetching players", error);
    return {
      year,
      players: [],
      categoryStatsPer: EMPTY_CATEGORY_STATS,
      categoryStatsTotal: EMPTY_CATEGORY_STATS,
    };
  }
};

export { getPlayers };
