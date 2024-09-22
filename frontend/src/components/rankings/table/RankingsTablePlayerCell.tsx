import { memo } from "react";
import Image from "next/image";
import { IconBallBasketball, IconCalendarFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { colStyles } from "./RankingsTableUtils";
import { Player } from "@/types/playerTypes";
import Tooltip from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import TeamLogo from "@/components/team/TeamLogo";
import { Separator } from "@/components/ui/separator";
import PlayerHeadshot from "@/components/player/PlayerHeadshot";
import PlayerPositionBadges from "@/components/player/PlayerPositionBadges";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getInjuryAbbreviation, getTeamName } from "@/utils/consts";

interface PlayerCellProps {
  player: Player;
}

const PlayerCell_ = ({ player }: PlayerCellProps) => {
  return (
    <TableCell className={cn("w-64 min-w-64", colStyles)}>
      <HoverCard openDelay={350}>
        <HoverCardTrigger className="cursor-pointer">
          <div className="flex items-center pl-2 pr-1 pt-1.5">
            <PlayerHeadshot player={player} size="sm" />
            <div className="inline-block max-w-44 ml-2 mr-1 text-ellipsis overflow-hidden whitespace-nowrap">
              {player.firstName} {player.lastName}
            </div>
            <div className="inline-block w-8 text-red-400 text-2xs font-bold ml-0.5">
              {player.injuries.length > 0 &&
                getInjuryAbbreviation(player.injuries[0].status)}
            </div>
            {/* TODO: fix rookie season api */}
            {/* {row.original.yearsPro === 0 && (
                  <Tooltip label="Rookie season">
                    <IconPointFilled className="text-pink-400" size={18} />
                  </Tooltip>
                )} */}
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          side="right"
          sideOffset={-15}
          className="w-96 p-0 overflow-hidden"
        >
          <div className="flex items-end px-3 pt-4 bg-slate-50">
            <div className="w-28 relative">
              {/* ghost player number in top right corner */}
              <div className="absolute top-0 right-0 text-xl text-slate-400">
                <span className="text-sm mr-0.5">#</span>
                {player.jersey}
              </div>
              {/* ghost team logo behind player */}
              <div className="absolute top-0 opacity-50 z-0 -mt-1 -ml-1">
                <TeamLogo team={player.team} size="lg" useTooltip={false} />
              </div>
              <div className="z-10">
                <PlayerHeadshot player={player} size="lg" />
              </div>
            </div>
            <div className="w-52 flex flex-col mx-4 mb-2">
              <div className="text-base font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                {player.firstName} {player.lastName}
              </div>
              <div className="text-sm">{getTeamName(player.team)}</div>
              <div className="mt-1">
                <PlayerPositionBadges positions={player.positions} />
              </div>
            </div>
          </div>
          <div className="h-9 flex items-center gap-2 px-3 py-1.5 bg-slate-100 border-y border-slate-150">
            <Badge variant="default" className="px-2">
              <div className="flex items-center gap-0.75">
                <Tooltip
                  label={`${player.age} years old`}
                  className="flex items-center gap-0.75"
                >
                  <IconCalendarFilled size={14} />
                  {player.age}y
                </Tooltip>
              </div>
            </Badge>
            <Badge variant="default" className="px-2">
              <div className="flex items-center gap-0.75">
                <Tooltip
                  label={`${player.yearsPro} years of NBA experience`}
                  className="flex items-center gap-0.75"
                >
                  <IconBallBasketball size={14} />
                  {player.yearsPro}y
                </Tooltip>
              </div>
            </Badge>
            <Separator orientation="vertical" className="h-full" />
            <Badge variant="outline" className="px-2">
              <div className="flex items-center gap-0.75">
                <Tooltip label={"Hashtag Basketball Player Rank"}>
                  <Image
                    src="/img/sources/hashtag.png"
                    width={14}
                    height={14}
                    alt="Hashtag Basketball"
                  />
                </Tooltip>
                {player.rank}
              </div>
            </Badge>
            <Badge variant="outline" className="px-2">
              <div className="flex items-center gap-0.75">
                <Tooltip label={"ESPN Average Auction Price"}>
                  <Image
                    src="/img/sources/espn.png"
                    width={14}
                    height={14}
                    alt="ESPN"
                  />
                </Tooltip>
                ${player.auctionEspnAvg}
              </div>
            </Badge>
            <Badge variant="outline" className="px-2">
              <div className="flex items-center gap-0.75">
                <Tooltip label={"Yahoo Average Auction Price"}>
                  <Image
                    src="/img/sources/yahoo.png"
                    width={14}
                    height={14}
                    alt="Yahoo"
                  />
                </Tooltip>
                ${player.auctionYahooAvg}
              </div>
            </Badge>
          </div>
          {/* TODO: add recent news, or notes section */}
        </HoverCardContent>
      </HoverCard>
    </TableCell>
  );
};
const PlayerCell = memo(PlayerCell_);

export default PlayerCell;
