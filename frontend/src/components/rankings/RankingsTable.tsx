"use client";

import { Fragment, memo, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Tooltip from "@/components/ui/tooltip";
import {
  IconArrowUp,
  IconArrowDown,
  IconEqual,
  IconPointFilled,
} from "@tabler/icons-react";
import {
  calculateStatPercentiles,
  getNStats,
  getStats,
  totalCategories,
} from "@/data/stats";
import { EMPTY_PLAYER_STATS_NSCORE, Player } from "@/types/playerTypes";
import { Team } from "@/types/teamTypes";
import PlayerHeadshot from "../player/PlayerHeadshot";
import TeamLogo from "../team/TeamLogo";
import {
  headerColStyles,
  RankingsColumnGroup,
  RankingsHeaderCell,
  TableTd,
} from "./RankingsTableUtils";
import { cn } from "@/lib/utils";

/*
 * RANKINGS TABLE
 */
const getPlayerTrend = (player: Player) => {
  const playerTrend =
    player.pastYearStats === null ? (
      <Tooltip label="Rookie season">
        <IconPointFilled className="text-pink-400" size={18} />
      </Tooltip>
    ) : player.rank === player.pastYearRank ? (
      <Tooltip label="No change in rank from last season">
        <IconEqual className="text-blue-400" size={18} />
      </Tooltip>
    ) : player.rank > player.pastYearRank ? (
      <Tooltip label="Rank decreased from last season">
        <IconArrowDown className="text-red-400" size={18} />
      </Tooltip>
    ) : (
      <Tooltip label="Rank increased from last season">
        <IconArrowUp className="text-green-400" size={18} />
      </Tooltip>
    );
  return playerTrend;
};

interface RankingsTableProps {
  players: Player[];
  usePastYearStats: boolean;
  showSmartScores: boolean;
  showHighlights: boolean;
  punts: string[];
}

const RankingsTable_ = ({
  players,
  usePastYearStats,
  showSmartScores,
  showHighlights,
  punts,
}: RankingsTableProps) => {
  const u = usePastYearStats;
  const ss = showSmartScores;

  const getPercentileColor = useMemo(() => {
    return (stat: number, category: string) => {
      if (!showHighlights) return "bg-transparent";
      if (punts.includes(category)) return "bg-slate.100";
      const percentile = calculateStatPercentiles(stat, category);
      if (percentile === 0) {
        return "bg-red-300";
      } else if (percentile === 1) {
        return "bg-red-200";
      } else if (percentile === 2) {
        return "bg-transparent";
      } else if (percentile === 3) {
        return "bg-emerald-200";
      } else if (percentile === 4) {
        return "bg-emerald-300";
      } else {
        return "bg-transparent";
      }
    };
  }, [showHighlights, punts]);

  const columns = useMemo<ColumnDef<Player>[]>(() => {
    return [
      {
        id: "rank",
        accessorFn: (player) => (u ? player.pastYearRank : player.rank),
        header: ({ column }) => (
          <RankingsHeaderCell
            text="Rank"
            label="Rank (from Hashtag Basketball)"
            sort={column.getIsSorted()}
          />
        ),
        cell: (p) => <TableTd>{p.getValue() as number}</TableTd>,
        invertSorting: true,
      },
      {
        accessorKey: "auctionValuedAt",
        header: ({ column }) => (
          <RankingsHeaderCell
            text="$"
            label="Auction Value"
            sort={column.getIsSorted()}
          />
        ),
        cell: (p) => <TableTd>${(p.getValue() as number).toFixed(1)}</TableTd>,
      },
      {
        id: "team",
        accessorFn: (player) => (u ? player.pastYearTeam : player.team),
        header: ({ column }) => (
          <RankingsHeaderCell
            text="Team"
            label="Team"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ row }) => (
          <TableTd>
            {u ? (
              <TeamLogo team={row.original.pastYearTeam as Team} size="sm" />
            ) : (
              <Fragment>
                {row.original.team !== row.original.pastYearTeam && (
                  <Tooltip label="Changing teams this season">
                    <IconPointFilled className="text-pink-400 pr-1" size={18} />
                  </Tooltip>
                )}
                <TeamLogo team={row.original.team as Team} size="sm" />
              </Fragment>
            )}
          </TableTd>
        ),
        invertSorting: true,
        sortDescFirst: true,
      },
      {
        id: "name",
        accessorFn: (player) => player.firstName + player.lastName,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="Player"
            label="Player Name"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ row }) => {
          return (
            <TableCell>
              <div className="flex items-center px-4 pt-1.5">
                <PlayerHeadshot player={row.original} size="sm" />
                <div className="flex items-center ml-2 mr-1">
                  {row.original.firstName} {row.original.lastName}
                </div>
                {!u && getPlayerTrend(row.original)}
              </div>
            </TableCell>
          );
        },
      },
      {
        accessorKey: "age",
        header: ({ column }) => (
          <RankingsHeaderCell
            text="Age"
            label="Age"
            sort={column.getIsSorted()}
          />
        ),
        cell: (p) => (
          <TableTd>
            {u ? (p.getValue() as number) - 1 : (p.getValue() as number)}
          </TableTd>
        ),
      },
      {
        id: "gp",
        accessorFn: (player) =>
          u
            ? player.pastYearStats
              ? player.pastYearStats.gp
              : 0
            : player.projections.gp,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="GP"
            label="Games Played"
            sort={column.getIsSorted()}
          />
        ),
        cell: (p) => <TableTd>{p.getValue() as number}</TableTd>,
      },
      {
        id: "mpg",
        accessorFn: (player) =>
          u
            ? player.pastYearStats
              ? player.pastYearStats.mpg
              : 0
            : player.projections.mpg,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="MPG"
            label="Minutes Per Game"
            sort={column.getIsSorted()}
          />
        ),
        cell: (p) => <TableTd>{(p.getValue() as number).toFixed(1)}</TableTd>,
      },
      {
        id: "fg",
        accessorFn: (player) =>
          ss ? getNStats(player, u).fgImpact : getStats(player, u).fgImpact,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="FG"
            label="Field Goal %"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ row }) => {
          const playerStats = getStats(row.original, u);
          const playerNStats = getNStats(row.original, u);
          return (
            <TableTd
              className={getPercentileColor(
                playerStats.fgm / playerStats.fga,
                "fg"
              )}
            >
              <div className="flex flex-col items-center">
                {ss ? (
                  <div>{playerNStats.fgImpact.toFixed(2)}</div>
                ) : (
                  <div className="flex items-center">
                    <div>
                      {playerStats.fga > 0
                        ? (playerStats.fgm / playerStats.fga).toFixed(2)
                        : (0).toFixed(2)}
                    </div>
                    <span className="text-2xs ml-1">
                      ({playerStats.fgm.toFixed(2)} /{" "}
                      {playerStats.fga.toFixed(2)})
                    </span>
                  </div>
                )}
              </div>
            </TableTd>
          );
        },
      },
      {
        id: "ft",
        accessorFn: (player) =>
          ss ? getNStats(player, u).ftImpact : getStats(player, u).ftImpact,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="FT"
            label="Free Throw %"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ row }) => {
          const playerStats = getStats(row.original, u);
          const playerNStats = getNStats(row.original, u);
          return (
            <TableTd
              className={getPercentileColor(
                playerStats.ftm / playerStats.fta,
                "ft"
              )}
            >
              <div className="flex flex-col items-center">
                {ss ? (
                  <div>{playerNStats.ftImpact.toFixed(2)}</div>
                ) : (
                  <div className="flex items-center">
                    <div>
                      {playerStats.fta > 0
                        ? (playerStats.ftm / playerStats.fta).toFixed(2)
                        : (0).toFixed(2)}
                    </div>
                    <span className="text-2xs ml-1">
                      ({playerStats.ftm.toFixed(2)} /{" "}
                      {playerStats.fta.toFixed(2)})
                    </span>
                  </div>
                )}
              </div>
            </TableTd>
          );
        },
      },
      {
        id: "tpm",
        accessorFn: (player) =>
          ss ? getNStats(player, u).tpm : getStats(player, u).tpm,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="3PM"
            label="3-Pointers Made"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell }) => {
          const tpm = cell.getValue() as number;
          return (
            <TableTd className={getPercentileColor(tpm, "tpm")}>
              {tpm.toFixed(1)}
            </TableTd>
          );
        },
      },
      {
        id: "pts",
        accessorFn: (player) =>
          ss ? getNStats(player, u).pts : getStats(player, u).pts,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="PTS"
            label="Points"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell }) => {
          const pts = cell.getValue() as number;
          return (
            <TableTd className={getPercentileColor(pts, "pts")}>
              {pts.toFixed(1)}
            </TableTd>
          );
        },
      },
      {
        id: "reb",
        accessorFn: (player) =>
          ss ? getNStats(player, u).reb : getStats(player, u).reb,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="REB"
            label="Rebounds"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell }) => {
          const reb = cell.getValue() as number;
          return (
            <TableTd className={getPercentileColor(reb, "reb")}>
              {reb.toFixed(1)}
            </TableTd>
          );
        },
      },
      {
        id: "ast",
        accessorFn: (player) =>
          ss ? getNStats(player, u).ast : getStats(player, u).ast,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="AST"
            label="Assists"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell }) => {
          const ast = cell.getValue() as number;
          return (
            <TableTd className={getPercentileColor(ast, "ast")}>
              {ast.toFixed(1)}
            </TableTd>
          );
        },
      },
      {
        id: "stl",
        accessorFn: (player) =>
          ss ? getNStats(player, u).stl : getStats(player, u).stl,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="STL"
            label="Steals"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell }) => {
          const stl = cell.getValue() as number;
          return (
            <TableTd className={getPercentileColor(stl, "stl")}>
              {stl.toFixed(1)}
            </TableTd>
          );
        },
      },
      {
        id: "blk",
        accessorFn: (player) =>
          ss ? getNStats(player, u).blk : getStats(player, u).blk,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="BLK"
            label="Blocks"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell }) => {
          const blk = cell.getValue() as number;
          return (
            <TableTd className={getPercentileColor(blk, "blk")}>
              {blk.toFixed(1)}
            </TableTd>
          );
        },
      },
      {
        id: "to",
        accessorFn: (player) =>
          ss ? getNStats(player, u).to : getStats(player, u).to,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="TO"
            label="Turnovers"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell }) => {
          const to = cell.getValue() as number;
          return (
            <TableTd className={getPercentileColor(to, "to")}>
              {to.toFixed(1)}
            </TableTd>
          );
        },
        invertSorting: true,
      },
      {
        id: "total",
        accessorFn: (player) => {
          const total = getNStats(player, u).total;
          return total;
        },
        header: ({ column }) => (
          <RankingsHeaderCell
            text="Total"
            label="Total Smart Score"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell }) => (
          <TableTd className="font-medium">
            {(cell.getValue() as number).toFixed(2)}
          </TableTd>
        ),
      },
    ];
  }, [u, ss, getPercentileColor]);

  useEffect(() => {
    setColumnVisibility({ auctionValuedAt: !u });
  }, [u, players]);

  const currentYearPlayers = useMemo<Player[]>(() => {
    if (players.length > 0) {
      return players
        .filter((player) => {
          if (usePastYearStats && !player.pastYearRank) return false;
          if (!usePastYearStats && !player.rank) return false;
          return true;
        })
        .map((player) => {
          return {
            ...player,
            projectionNScores: {
              ...getNStats(player, false),
              total: totalCategories(
                player.projectionNScores
                  ? player.projectionNScores
                  : EMPTY_PLAYER_STATS_NSCORE,
                punts
              ),
            },
            pastYearNScores: {
              ...getNStats(player, true),
              total: totalCategories(
                player.pastYearNScores
                  ? player.pastYearNScores
                  : EMPTY_PLAYER_STATS_NSCORE,
                punts
              ),
            },
          };
        });
    } else {
      return [];
    }
  }, [players, usePastYearStats, punts]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const playersTable = useReactTable<Player>({
    columns,
    data: currentYearPlayers,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility,
      sorting,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
  });

  return (
    <div className="shadow-md w-full overflow-x-scroll">
      <Table className="w-max">
        <RankingsColumnGroup u={u} ss={ss} />
        <TableHeader>
          {playersTable.getHeaderGroups().map((headerGroup) => (
            <TableRow className={headerColStyles} key={headerGroup.id}>
              <TableHead
                key={headerGroup.id}
                className={cn("border-slate-300 p-0 ", headerColStyles)}
              >
                <RankingsHeaderCell text="#" label="Row #" />
              </TableHead>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={`${headerGroup.id}-${header.id}`}
                  className={cn(
                    "border-slate-300 p-0",
                    headerColStyles,
                    header.column.getCanSort()
                      ? "cursor-pointer"
                      : "cursor-auto"
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                  title={
                    header.column.getCanSort()
                      ? header.column.getNextSortingOrder() === "asc"
                        ? "Sort ascending"
                        : header.column.getNextSortingOrder() === "desc"
                        ? "Sort descending"
                        : "Clear sort"
                      : undefined
                  }
                >
                  {flexRender(header.column.columnDef.header, {
                    ...header.getContext(),
                  })}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {playersTable.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id} className="h-10 odd:bg-slate-50">
                <TableTd className="font-medium">{row.index + 1}</TableTd>
                {row.getVisibleCells().map((cell) =>
                  flexRender(cell.column.columnDef.cell, {
                    ...cell.getContext(),
                    key: `${row.id}-${cell.id}`,
                  })
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
const RankingsTable = memo(RankingsTable_);

export default RankingsTable;
