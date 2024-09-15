import { Player } from "@/types/playerTypes";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface PlayerHeadshotProps {
  player: Player;
  size: "sm" | "md" | "lg";
}

const PlayerHeadshot = ({ player, size }: PlayerHeadshotProps) => {
  const small = 45;
  const medium = 90;
  const large = 135;

  return (
    <Avatar
      style={{ width: size === "sm" ? small : size === "md" ? medium : large }}
    >
      <AvatarImage
        src={player.headshot}
        alt={player.firstName + " " + player.lastName}
      />
    </Avatar>
  );
};

export default PlayerHeadshot;
