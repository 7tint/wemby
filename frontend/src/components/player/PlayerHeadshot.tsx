import { Player } from "@/types/playerTypes";

interface PlayerHeadshotProps {
  player: Player;
  size: "sm" | "md" | "lg";
}

const PlayerHeadshot = ({ player, size }: PlayerHeadshotProps) => {
  const small = "45px";
  const medium = "90px";
  const large = "135px";

  return (
    <img
      src={player.headshot}
      alt={player.firstName + " " + player.lastName}
      width={size === "sm" ? small : size === "md" ? medium : large}
    />
  );
};

export default PlayerHeadshot;
