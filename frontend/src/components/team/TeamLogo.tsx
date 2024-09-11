import { getTeamName, Team } from "@/types/teamTypes";
import { Image, Tooltip, TooltipProps } from "@chakra-ui/react";

interface TeamLogoProps {
  team: Team;
  size: "sm" | "md" | "lg";
  useTooltip?: boolean;
  tooltipProps?: Omit<TooltipProps, "children">;
}

const TeamLogo = ({
  team,
  size,
  useTooltip = true,
  tooltipProps,
}: TeamLogoProps) => {
  const small = "25px";
  const medium = "50px";
  const large = "75px";

  return team === null ? (
    <></>
  ) : useTooltip ? (
    <Tooltip label={getTeamName(team)} aria-label={team} {...tooltipProps}>
      <Image
        src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${team.toLowerCase()}.png&h=1200&w=1200`}
        alt={team}
        width={size === "sm" ? small : size === "md" ? medium : large}
      />
    </Tooltip>
  ) : (
    <Image
      src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${team.toLowerCase()}.png&h=1200&w=1200`}
      alt={team}
      width={size === "sm" ? small : size === "md" ? medium : large}
    />
  );
};

export default TeamLogo;
