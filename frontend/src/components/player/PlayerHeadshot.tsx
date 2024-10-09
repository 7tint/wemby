import { cn } from "@/lib/utils";
import { Player } from "@/types/playerTypes";
import Image from "next/image";
import { memo } from "react";

interface PlayerHeadshotProps {
  player: Player;
  size: "sm" | "md" | "lg";
  className?: string;
}

const PlayerHeadshot = ({ player, size, className }: PlayerHeadshotProps) => {
  const small = 44;
  const medium = 64;
  const large = 112;
  const proportion = 254 / 350;

  const width = size === "sm" ? small : size === "md" ? medium : large;
  const height = Math.round(width * proportion);
  const widthClass = size === "sm" ? "w-11" : size === "md" ? "w-16" : "w-28";

  // original headshot in form of https://a.espncdn.com/i/headshots/nba/players/full/{id}.png
  // get id to resize headshot
  const id =
    player.headshot ===
    "https://secure.espncdn.com/combiner/i?img=/i/headshots/nophoto.png"
      ? null
      : player.headshot.split("/").pop()?.split(".")[0] || null;

  const headshotSrc =
    size === "sm" && id
      ? `https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${id}.png&w=96&h=70&cb=1`
      : player.headshot;

  return (
    <Image
      className={cn(widthClass, "relative h-auto", className)}
      src={headshotSrc}
      alt={player.firstName + " " + player.lastName}
      width={width}
      height={height}
      priority
    />
  );
};

export default memo(PlayerHeadshot);
