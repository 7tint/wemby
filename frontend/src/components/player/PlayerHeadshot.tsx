import Image from "next/image";
import { Player } from "@/types/playerTypes";

interface PlayerHeadshotProps {
  player: Player;
  size: "sm" | "md" | "lg";
}

const PlayerHeadshot = ({ player, size }: PlayerHeadshotProps) => {
  const small = 45;
  const medium = 90;
  const large = 135;

  return (
    <Image
      src={player.headshot}
      alt={player.firstName + " " + player.lastName}
      width={size === "sm" ? small : size === "md" ? medium : large}
      height={size === "sm" ? small : size === "md" ? medium : large}
    />
  );
};

export default PlayerHeadshot;
