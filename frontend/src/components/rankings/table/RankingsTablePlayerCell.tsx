import { memo } from "react";
import Image from "next/image";
import {
  IconBallBasketball,
  IconCalendarFilled,
  IconCoinFilled,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { colStyles } from "./RankingsTableUtils";
import { Player } from "@/types/playerTypes";
import {
  convertInchesToFeet,
  getInjuryAbbreviation,
  getTeamName,
  YEAR,
} from "@/utils/consts";
import Tooltip from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import TeamLogo from "@/components/team/TeamLogo";
import PlayerHeadshot from "@/components/player/PlayerHeadshot";
import PlayerPositionBadges from "@/components/player/PlayerPositionBadges";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

interface PlayerCellProps {
  player: Player;
  showPlayerCard: boolean;
}

const PlayerCell_ = ({ player, showPlayerCard }: PlayerCellProps) => {
  return showPlayerCard ? (
    <TableCell className={cn("w-52 min-w-52", colStyles)}>
      <div className="flex items-center pl-2 pr-1">
        <HoverCard openDelay={350}>
          <HoverCardTrigger className="cursor-pointer flex items-center">
            <PlayerHeadshot className="pt-1.5" player={player} size="sm" />
            <div className="inline-block max-w-44 ml-2 mr-1 text-ellipsis overflow-hidden whitespace-nowrap">
              {player.firstName} {player.lastName}
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            sideOffset={-15}
            className="w-96 p-0 overflow-hidden"
          >
            {/* TODO: add indication for rookie */}
            <div className="flex items-end px-3 pt-4 bg-slate-50">
              <div className="w-28 relative">
                {/* ghost player number in top right corner */}
                <div className="absolute -top-2 right-0 text-xl text-slate-400">
                  <span className="text-sm mr-0.5">#</span>
                  {player.jersey}
                </div>
                <div className="absolute top-0 opacity-50 z-0 -mt-4">
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
                <div className="mt-0.5 text-xs text-slate-500 font-medium">
                  <span className="mr-2">
                    {convertInchesToFeet(player.height)}
                  </span>
                  <span>{player.weight} lbs</span>
                </div>
                <div className="flex items-center mt-1 gap-1.5">
                  <PlayerPositionBadges positions={player.positions} />
                  <Separator orientation="vertical" className="h-5" />
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
                        label={`${player.yearsPro} years in the NBA`}
                        className="flex items-center gap-0.75"
                      >
                        <IconBallBasketball size={14} />
                        {player.draft
                          ? YEAR - player.draft.year
                          : player.yearsPro}
                        y
                      </Tooltip>
                    </div>
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border-y border-slate-150">
              <Badge variant="outline" className="px-2">
                <div className="flex items-center gap-0.75">
                  <Tooltip label={"Smart Score Auction Price"}>
                    <IconCoinFilled className="text-cyan-600" size={14} />
                  </Tooltip>
                  ${player.auctionValuedAt}
                </div>
              </Badge>
              <Badge variant="outline" className="px-2">
                <div className="flex items-center gap-0.75">
                  <Tooltip label={"Hashtag Basketball Auction Price"}>
                    <Image
                      src="/img/sources/hashtag.png"
                      width={14}
                      height={14}
                      alt="Hashtag Basketball"
                    />
                  </Tooltip>
                  ${player.auctionHashtag}
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
            <div className="px-4 pt-2 pb-3">
              <div className="mb-1 font-semibold">
                {player.injuries.length > 0 ? (
                  <div>
                    <span className="text-red-400">
                      {player.injuries[0].status}
                    </span>{" "}
                    -{" "}
                    {player.injuries[0].details.side &&
                      player.injuries[0].details.side !== "Not Specified" &&
                      `${player.injuries[0].details.side}`}{" "}
                    {player.injuries[0].details.location &&
                      `${player.injuries[0].details.location}`}
                  </div>
                ) : (
                  <div className="text-green-700">Healthy</div>
                )}
              </div>
              {player.injuries.length > 0 ? (
                <div className="text-xs">
                  <div className="text-slate-500 italic">
                    {player.injuries[0].shortComment}
                  </div>
                  <div className="text-slate-700 text-right mt-1 font-semibold">
                    Estimated Return: {player.injuries[0].details.returnDate}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">
                  No injuries to report
                </div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
        <div className="inline-block w-8 text-red-400 text-2xs font-bold ml-0.5">
          {player.injuries.length > 0 && (
            <Tooltip label={player.injuries[0].details.location}>
              {getInjuryAbbreviation(player.injuries[0].status)}
            </Tooltip>
          )}
        </div>
      </div>
    </TableCell>
  ) : (
    <TableCell className={cn("w-52 min-w-52", colStyles)}>
      <div className="flex items-center pl-2 pr-1">
        <PlayerHeadshot className="pt-1.5" player={player} size="sm" />
        <div className="inline-block max-w-44 ml-2 mr-1 text-ellipsis overflow-hidden whitespace-nowrap">
          {player.firstName} {player.lastName}
        </div>
      </div>
    </TableCell>
  );
};
const PlayerCell = memo(PlayerCell_);

export default PlayerCell;
