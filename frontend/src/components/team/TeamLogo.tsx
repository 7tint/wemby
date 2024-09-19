import { getTeamName, Team } from "@/types/teamTypes";
import Tooltip from "@/components/ui/tooltip";
import Image from "next/image";

interface TeamLogoProps {
  team: Team;
  size: "sm" | "md" | "lg";
  useTooltip?: boolean;
}

const TeamLogo = ({ team, size, useTooltip = true }: TeamLogoProps) => {
  const small = 24;
  const medium = 48;
  const large = 64;

  return team === null ? (
    <></>
  ) : useTooltip ? (
    <Tooltip label={getTeamName(team)}>
      <Image
        src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${team.toLowerCase()}.png&h=1200&w=1200`}
        alt={team}
        width={size === "sm" ? small : size === "md" ? medium : large}
        height={size === "sm" ? small : size === "md" ? medium : large}
      />
    </Tooltip>
  ) : (
    <Image
      src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${team.toLowerCase()}.png&h=1200&w=1200`}
      alt={team}
      width={size === "sm" ? small : size === "md" ? medium : large}
      height={size === "sm" ? small : size === "md" ? medium : large}
    />
  );
};

export default TeamLogo;
