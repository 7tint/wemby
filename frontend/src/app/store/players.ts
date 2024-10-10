import { getCookie, setCookie } from "cookies-next";

export const getFavouritePlayers = (): Set<number> => {
  const favouritesRaw = getCookie("favourites");
  const favouritesArr = favouritesRaw ? JSON.parse(favouritesRaw) : [];
  return new Set(favouritesArr);
};

export const setFavouritePlayer = (playerId: number) => {
  const favouritesRaw = getCookie("favourites");
  const favourites = favouritesRaw ? JSON.parse(favouritesRaw) : [];

  if (favourites.includes(playerId)) {
    const index = favourites.indexOf(playerId);
    favourites.splice(index, 1);
  } else {
    favourites.push(playerId);
  }
  setCookie("favourites", JSON.stringify(favourites));
};
