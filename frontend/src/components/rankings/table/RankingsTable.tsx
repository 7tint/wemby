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
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Tooltip from "@/components/ui/tooltip";
import {
  IconPointFilled,
  IconArrowBadgeUpFilled,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { calculateStatPercentiles, getNStats, getStats } from "@/data/stats";
import { Player } from "@/types/playerTypes";
import { Team } from "@/types/teamTypes";
import PlayerHeadshot from "../../player/PlayerHeadshot";
import TeamLogo from "../../team/TeamLogo";
import {
  headerColStyles,
  RankingsColumnGroup,
  RankingsHeaderCell,
  TableTd,
} from "./RankingsTableUtils";
import { cn } from "@/lib/utils";
import usePlayersToDisplay from "@/hooks/usePlayersToDisplay";

/*
 * RANKINGS TABLE
 */
interface RankingsTableProps {
  players: Player[];
  showSmartScores: boolean;
  showDraftColumns: boolean;
  showHighlights: boolean;
  punts: string[];
  positions: string[];
}

const RankingsTable_ = ({
  players,
  showSmartScores,
  showDraftColumns,
  showHighlights,
  punts,
  positions,
}: RankingsTableProps) => {
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
    const getDisplayValue = (player: Player) =>
      showSmartScores ? getNStats(player) : getStats(player);

    return [
      {
        accessorKey: "rank",
        header: ({ column }) => (
          <RankingsHeaderCell
            text={<IconArrowBadgeUpFilled size={18} />}
            label="Rank (from Hashtag Basketball)"
            sort={column.getIsSorted()}
          />
        ),
        cell: (p) => (
          <TableTd className="font-medium">{p.getValue() as number}</TableTd>
        ),
        invertSorting: true,
      },
      {
        accessorKey: "auctionValuedAt",
        header: ({ column }) => (
          <RankingsHeaderCell
            text={<IconCurrencyDollar className="mt-2.5" size={16} />}
            label="Auction Value"
            sort={column.getIsSorted()}
          />
        ),
        cell: (p) => (
          <TableTd>
            ${p.getValue() === null ? "0" : (p.getValue() as number).toFixed(1)}
          </TableTd>
        ),
      },
      {
        accessorKey: "team",
        header: ({ column }) => (
          <RankingsHeaderCell
            text="Team"
            label="Team"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ row }) => (
          <TableTd>
            <Fragment>
              {row.original.changedTeams && (
                <Tooltip label="Changing teams this season">
                  <IconPointFilled className="text-pink-400 pr-1" size={18} />
                </Tooltip>
              )}
              <TeamLogo team={row.original.team as Team} size="sm" />
            </Fragment>
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
            className="min-w-64"
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
                {/* TODO: fix rookie season api */}
                {/* {row.original.yearsPro === 0 && (
                  <Tooltip label="Rookie season">
                    <IconPointFilled className="text-pink-400" size={18} />
                  </Tooltip>
                )} */}
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
        cell: (p) => <TableTd>{p.getValue() as number}</TableTd>,
      },
      {
        id: "pos",
        accessorFn: (player) => {
          if (!player.positions || player.positions[0] === "") return "???";
          else return player.positions.join(", ");
        },
        header: ({ column }) => (
          <RankingsHeaderCell
            text="Pos"
            label="Position"
            sort={column.getIsSorted()}
          />
        ),
        cell: (p) => (
          <TableTd className="font-medium">{p.getValue() as string}</TableTd>
        ),
        sortingFn: (a, b) => {
          const aPositions = a.original.positions;
          const bPositions = b.original.positions;
          const order = ["PG", "SG", "SF", "PF", "C", ""];
          for (let i = 0; i < order.length; i++) {
            if (aPositions.includes(order[i]) && !bPositions.includes(order[i]))
              return 1;
            if (!aPositions.includes(order[i]) && bPositions.includes(order[i]))
              return -1;
          }
          return 0;
        },
        sortDescFirst: true,
        filterFn: (row, columnId, filterValue: string[]) => {
          const playerPos = row.original.positions;
          return (
            filterValue.length === 0 ||
            filterValue.some((pos) => playerPos.includes(pos))
          );
        },
      },
      {
        accessorKey: "stats.gp",
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
        accessorKey: "stats.mpg",
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
        accessorFn: (player) => getDisplayValue(player).fgImpact,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="FG%"
            label="Field Goal %"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ row }) => {
          const playerStats = getStats(row.original);
          const playerNStats = getNStats(row.original);
          return (
            <TableTd
              className={getPercentileColor(
                playerStats.fgm / playerStats.fga,
                "fg"
              )}
            >
              <div className="flex flex-col items-center">
                {showSmartScores ? (
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
        accessorFn: (player) => getDisplayValue(player).ftImpact,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="FT%"
            label="Free Throw %"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ row }) => {
          const playerStats = getStats(row.original);
          const playerNStats = getNStats(row.original);
          return (
            <TableTd
              className={getPercentileColor(
                playerStats.ftm / playerStats.fta,
                "ft"
              )}
            >
              <div className="flex flex-col items-center">
                {showSmartScores ? (
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
        accessorFn: (player) => getDisplayValue(player).tpm,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="3PM"
            label="3-Pointers Made"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell, row }) => {
          const tpm = cell.getValue() as number;
          return (
            <TableTd
              className={getPercentileColor(getStats(row.original).tpm, "tpm")}
            >
              {tpm.toFixed(1)}
            </TableTd>
          );
        },
      },
      {
        id: "pts",
        accessorFn: (player) => getDisplayValue(player).pts,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="PTS"
            label="Points"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell, row }) => {
          const pts = cell.getValue() as number;
          return (
            <TableTd
              className={getPercentileColor(getStats(row.original).pts, "pts")}
            >
              {pts.toFixed(1)}
            </TableTd>
          );
        },
      },
      {
        id: "reb",
        accessorFn: (player) => getDisplayValue(player).reb,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="REB"
            label="Rebounds"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell, row }) => {
          const reb = cell.getValue() as number;
          return (
            <TableTd
              className={getPercentileColor(getStats(row.original).reb, "reb")}
            >
              {reb.toFixed(1)}
            </TableTd>
          );
        },
      },
      {
        id: "ast",
        accessorFn: (player) => getDisplayValue(player).ast,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="AST"
            label="Assists"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell, row }) => {
          const ast = cell.getValue() as number;
          return (
            <TableTd
              className={getPercentileColor(getStats(row.original).ast, "ast")}
            >
              {ast.toFixed(1)}
            </TableTd>
          );
        },
      },
      {
        id: "stl",
        accessorFn: (player) => getDisplayValue(player).stl,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="STL"
            label="Steals"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell, row }) => {
          const stl = cell.getValue() as number;
          return (
            <TableTd
              className={getPercentileColor(getStats(row.original).stl, "stl")}
            >
              {stl.toFixed(1)}
            </TableTd>
          );
        },
      },
      {
        id: "blk",
        accessorFn: (player) => getDisplayValue(player).blk,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="BLK"
            label="Blocks"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell, row }) => {
          const blk = cell.getValue() as number;
          return (
            <TableTd
              className={getPercentileColor(getStats(row.original).blk, "blk")}
            >
              {blk.toFixed(1)}
            </TableTd>
          );
        },
      },
      {
        id: "to",
        accessorFn: (player) => getDisplayValue(player).to,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="TO"
            label="Turnovers"
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell, row }) => {
          const to = cell.getValue() as number;
          return (
            <TableTd
              className={getPercentileColor(getStats(row.original).to, "to")}
            >
              {to.toFixed(1)}
            </TableTd>
          );
        },
        invertSorting: showSmartScores ? false : true,
      },
      {
        id: "total",
        accessorFn: (player) => getNStats(player).total,
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
  }, [showSmartScores, getPercentileColor]);

  useEffect(() => {
    setColumnVisibility({ auctionValuedAt: showDraftColumns });
  }, [players, showDraftColumns]);

  useEffect(() => {
    setColumnFilters([
      {
        id: "pos",
        value: positions,
      },
    ]);
  }, [positions]);

  const playersList = usePlayersToDisplay(players, punts, showSmartScores);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "total",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const playersTable = useReactTable<Player>({
    columns,
    data: playersList,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
      sorting,
      columnFilters,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div
      className="shadow-md w-full overflow-x-scroll"
      style={{ fontSize: "13px" }}
    >
      <Table className="w-max min-w-full">
        <RankingsColumnGroup
          showDraftColumns={showDraftColumns}
          showSmartScores={showSmartScores}
        />
        <TableHeader>
          {playersTable.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className={headerColStyles}
              style={{ height: 50 }}
            >
              <TableHead
                key={headerGroup.id}
                className={cn("border-slate-300 p-0 ", headerColStyles)}
              >
                <RankingsHeaderCell text="#" label="Row #" />
              </TableHead>
              {headerGroup.headers.map((header) => (
                <TableHead
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
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {playersTable.getRowModel().rows.map((row, index) => {
            return (
              <TableRow key={row.id} className="h-10 odd:bg-slate-50">
                <TableTd className="text-slate-400">{index + 1}</TableTd>
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
