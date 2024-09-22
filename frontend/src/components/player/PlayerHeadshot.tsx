import { cn } from "@/lib/utils";
import { Player } from "@/types/playerTypes";
import Image from "next/image";

interface PlayerHeadshotProps {
  player: Player;
  size: "sm" | "md" | "lg";
}

const PlayerHeadshot = ({ player, size }: PlayerHeadshotProps) => {
  const small = 44;
  const medium = 64;
  const large = 112;
  const proportion = 254 / 350;

  const width = size === "sm" ? small : size === "md" ? medium : large;
  const height = Math.round(width * proportion);

  const widthClass = size === "sm" ? "w-11" : size === "md" ? "w-16" : "w-28";

  return (
    <Image
      className={cn(widthClass, "relative h-auto")}
      src={player.headshot}
      alt={player.firstName + " " + player.lastName}
      width={width}
      height={height}
      priority
    />
  );
};

export default PlayerHeadshot;
