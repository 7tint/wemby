import { Player } from "@/types/playerTypes";
import Image from "next/image";

interface PlayerHeadshotProps {
  player: Player;
  size: "sm" | "md" | "lg";
}

const PlayerHeadshot = ({ player, size }: PlayerHeadshotProps) => {
  const small = 44;
  const medium = 64;
  const large = 96;
  const proportion = 38 / 45;

  const width = size === "sm" ? small : size === "md" ? medium : large;
  const height = width * proportion;

  return (
    <Image
      src={player.headshot}
      alt={player.firstName + " " + player.lastName}
      width={width}
      height={height}
      className="w-11 h-auto"
      priority
    />
  );
};

export default PlayerHeadshot;
