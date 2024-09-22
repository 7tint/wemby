import { Badge } from "../ui/badge";

interface PlayerPositionBadgesProps {
  positions: string[];
}

const PlayerPositionBadges = ({ positions }: PlayerPositionBadgesProps) => {
  const variant = (position: string) => {
    switch (position) {
      case "PG":
        return "pink";
      case "SG":
        return "orange";
      case "SF":
        return "yellow";
      case "PF":
        return "lime";
      case "C":
        return "sky";
      default:
        return "default";
    }
  };
  return (
    <div className="flex gap-0.75">
      {positions.map((position) => (
        <Badge
          key={position}
          variant={variant(position)}
          className="text-2xs px-2 py-0"
        >
          {position}
        </Badge>
      ))}
    </div>
  );
};

export default PlayerPositionBadges;
