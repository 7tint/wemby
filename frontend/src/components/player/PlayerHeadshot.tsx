import { Player } from "@/types/playerTypes";
import Image from "next/image";

interface PlayerHeadshotProps {
  player: Player;
  size: "sm" | "md" | "lg";
}

const PlayerHeadshot = ({ player, size }: PlayerHeadshotProps) => {
  const small = 45;
  const medium = 90;
  const large = 135;
  const proportion = 436 / 600;

  const width = size === "sm" ? small : size === "md" ? medium : large;
  const height = width * proportion;

  return (
    <Image
      src={player.headshot}
      alt={player.firstName + " " + player.lastName}
      width={width}
      height={height}
      className="w-auto h-auto"
      priority
    />
  );
};

export default PlayerHeadshot;
