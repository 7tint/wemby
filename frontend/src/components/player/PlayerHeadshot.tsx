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

  const headshotSrc =
    size === "sm" &&
    player.headshot !==
      "https://secure.espncdn.com/combiner/i?img=/i/headshots/nophoto.png"
      ? `https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${player.id}.png&w=96&h=70&cb=1`
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
