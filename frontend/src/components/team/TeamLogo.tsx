import { Team } from "@/types/teamTypes";
import Tooltip from "@/components/ui/tooltip";
import Image from "next/image";
import { getTeamName } from "@/utils/consts";
import { memo } from "react";

interface TeamLogoProps {
  team: Team;
  size: "xs" | "sm" | "md" | "lg";
  useTooltip?: boolean;
}

const TeamLogo = ({ team, size, useTooltip = true }: TeamLogoProps) => {
  const xsmall = 16;
  const small = 24;
  const medium = 48;
  const large = 64;

  const imgSize = size === "xs" || size === "sm" ? "250" : "800";

  return team === null ? (
    <></>
  ) : useTooltip ? (
    <Tooltip label={getTeamName(team)}>
      <Image
        className="relative"
        src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${team.toLowerCase()}.png&h=${imgSize}&w=${imgSize}`}
        alt={team}
        width={
          size === "xs"
            ? xsmall
            : size === "sm"
            ? small
            : size === "md"
            ? medium
            : large
        }
        height={
          size === "xs"
            ? xsmall
            : size === "sm"
            ? small
            : size === "md"
            ? medium
            : large
        }
      />
    </Tooltip>
  ) : (
    <Image
      className="relative"
      src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${team.toLowerCase()}.png&h=${imgSize}&w=${imgSize}`}
      alt={team}
      width={
        size === "xs"
          ? xsmall
          : size === "sm"
          ? small
          : size === "md"
          ? medium
          : large
      }
      height={
        size === "xs"
          ? xsmall
          : size === "sm"
          ? small
          : size === "md"
          ? medium
          : large
      }
    />
  );
};

export default memo(TeamLogo);
