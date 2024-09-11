import { Player } from "@/types/playerTypes";
import { Image } from "@chakra-ui/react";

interface PlayerHeadshotProps {
  player: Player;
  size: "sm" | "md" | "lg";
}

const PlayerHeadshot = ({ player, size }: PlayerHeadshotProps) => {
  const small = "45px";
  const medium = "90px";
  const large = "135px";

  return (
    <Image
      src={player.headshot}
      width={size === "sm" ? small : size === "md" ? medium : large}
      alt={player.firstName + " " + player.lastName}
    />
  );
};

export default PlayerHeadshot;
