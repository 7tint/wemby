import { API_URL } from "@/utils/env";

const getPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/api/players`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching players", error);
    return [];
  }
};

export { getPlayers };
