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
        return "teal";
      case "C":
        return "indigo";
      default:
        return "default";
    }
  };
  return (
    <div className="flex gap-1">
      {positions.map((position) => (
        <Badge
          key={position}
          variant={variant(position)}
          className="text-2xs px-1.5 py-0"
        >
          {position}
        </Badge>
      ))}
    </div>
  );
};

export default PlayerPositionBadges;
