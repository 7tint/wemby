"use client";

import { Fragment, memo, useEffect, useMemo, useState } from "react";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
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
  OnChangeFn,
  RowSelectionState,
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
  IconShirtSport,
} from "@tabler/icons-react";
import { calculateStatPercentiles, getNStats, getStats } from "@/data/stats";
import { Player } from "@/types/playerTypes";
import { Team } from "@/types/teamTypes";
import PlayerHeadshot from "../../player/PlayerHeadshot";
import TeamLogo from "../../team/TeamLogo";
import {
  cellWidthLg,
  cellWidthMd,
  cellWidthSm,
  cellWidthXl,
  colStyles,
  RankingsHeaderCell,
  TableTd,
} from "./RankingsTableUtils";
import { cn } from "@/lib/utils";
import usePlayersToDisplay from "@/hooks/usePlayersToDisplay";
import { Checkbox } from "@/components/ui/checkbox";
import useSelectedPlayers from "@/hooks/useSelectedPlayers";
import RankingsTableFooter from "./RankingsTableFooter";

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
  team: Team | null;
  selectPlayerIds: RowSelectionState;
  setSelectPlayerIds: OnChangeFn<RowSelectionState>;
  totalsMode?: boolean;
}

const RankingsTable_ = ({
  players,
  showSmartScores,
  showDraftColumns,
  showHighlights,
  punts,
  positions,
  team,
  selectPlayerIds,
  setSelectPlayerIds,
  totalsMode = false,
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
    const f = showSmartScores ? 2 : 1;
    const getDisplayValue = (player: Player) =>
      showSmartScores ? getNStats(player) : getStats(player);

    return [
      {
        accessorKey: "rank",
        header: ({ column }) => (
          <RankingsHeaderCell
            text={<IconArrowBadgeUpFilled size={18} />}
            label="Rank (from Hashtag Basketball)"
            width={cellWidthSm}
            sort={column.getIsSorted()}
          />
        ),
        cell: (p) => (
          <TableTd className="font-medium" width={cellWidthSm}>
            {p.getValue() as number}
          </TableTd>
        ),
        invertSorting: true,
      },
      {
        accessorKey: "team",
        header: ({ column }) => (
          <RankingsHeaderCell
            text={<IconShirtSport size={18} />}
            label="Team"
            width={cellWidthSm}
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ row }) => (
          <TableTd width={cellWidthSm}>
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
        filterFn: (row, _, filterValue: string | null) => {
          return filterValue === null || row.original.team === filterValue;
        },
      },
      {
        id: "name",
        accessorFn: (player) => player.firstName + player.lastName,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="Player"
            label="Player Name"
            sort={column.getIsSorted()}
            className="w-56 min-w-56"
          />
        ),
        cell: ({ row }) => {
          return (
            <TableCell className={cn("w-56 min-w-56", colStyles)}>
              <div className="flex items-center pl-2 pr-1 pt-1.5">
                <PlayerHeadshot player={row.original} size="sm" />
                <div className="inline-block ml-2 mr-1 text-ellipsis overflow-hidden whitespace-nowrap">
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
        accessorKey: "auctionValuedAt",
        header: ({ column }) => (
          <RankingsHeaderCell
            text={<IconCurrencyDollar className="mt-2.5" size={16} />}
            label="Auction Value"
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        cell: (p) => (
          <TableTd width={cellWidthMd}>
            ${p.getValue() === null ? "0" : (p.getValue() as number).toFixed(1)}
          </TableTd>
        ),
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
            width={cellWidthLg}
            sort={column.getIsSorted()}
          />
        ),
        cell: (p) => (
          <TableTd width={cellWidthLg}>{p.getValue() as string}</TableTd>
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
        filterFn: (row, _, filterValue: string[]) => {
          const playerPos = row.original.positions;
          return (
            filterValue.length === 0 ||
            filterValue.some((pos) => playerPos.includes(pos))
          );
        },
      },
      {
        accessorKey: "age",
        header: ({ column }) => (
          <RankingsHeaderCell
            text="Age"
            label="Age"
            width={cellWidthSm}
            sort={column.getIsSorted()}
          />
        ),
        cell: (p) => (
          <TableTd width={cellWidthSm}>{p.getValue() as number}</TableTd>
        ),
      },
      {
        accessorKey: "stats.gp",
        header: ({ column }) => (
          <RankingsHeaderCell
            text="GP"
            label="Games Played"
            width={cellWidthSm}
            sort={column.getIsSorted()}
          />
        ),
        cell: (p) => (
          <TableTd width={cellWidthSm}>{p.getValue() as number}</TableTd>
        ),
      },
      {
        accessorKey: "stats.mpg",
        header: ({ column }) => (
          <RankingsHeaderCell
            text="MPG"
            label="Minutes Per Game"
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        cell: (p) => (
          <TableTd width={cellWidthMd}>
            {(p.getValue() as number).toFixed(1)}
          </TableTd>
        ),
      },
      {
        id: "fg",
        accessorFn: (player) => getDisplayValue(player).fgImpact,
        header: ({ column }) => (
          <RankingsHeaderCell
            text="FG%"
            label="Field Goal %"
            width={showSmartScores ? cellWidthMd : cellWidthXl}
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
              width={showSmartScores ? cellWidthMd : cellWidthXl}
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
            width={showSmartScores ? cellWidthMd : cellWidthXl}
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
              width={showSmartScores ? cellWidthMd : cellWidthXl}
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
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell, row }) => {
          const tpm = cell.getValue() as number;
          return (
            <TableTd
              className={getPercentileColor(getStats(row.original).tpm, "tpm")}
              width={cellWidthMd}
            >
              {tpm.toFixed(f)}
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
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell, row }) => {
          const pts = cell.getValue() as number;
          return (
            <TableTd
              className={getPercentileColor(getStats(row.original).pts, "pts")}
              width={cellWidthMd}
            >
              {pts.toFixed(f)}
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
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell, row }) => {
          const reb = cell.getValue() as number;
          return (
            <TableTd
              className={getPercentileColor(getStats(row.original).reb, "reb")}
              width={cellWidthMd}
            >
              {reb.toFixed(f)}
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
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell, row }) => {
          const ast = cell.getValue() as number;
          return (
            <TableTd
              className={getPercentileColor(getStats(row.original).ast, "ast")}
              width={cellWidthMd}
            >
              {ast.toFixed(f)}
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
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell, row }) => {
          const stl = cell.getValue() as number;
          return (
            <TableTd
              className={getPercentileColor(getStats(row.original).stl, "stl")}
              width={cellWidthMd}
            >
              {stl.toFixed(f)}
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
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell, row }) => {
          const blk = cell.getValue() as number;
          return (
            <TableTd
              className={getPercentileColor(getStats(row.original).blk, "blk")}
              width={cellWidthMd}
            >
              {blk.toFixed(f)}
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
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell, row }) => {
          const to = cell.getValue() as number;
          return (
            <TableTd
              className={getPercentileColor(getStats(row.original).to, "to")}
              width={cellWidthMd}
            >
              {to.toFixed(f)}
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
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ cell }) => (
          <TableTd className="font-medium" width={cellWidthMd}>
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
      { id: "pos", value: positions },
      { id: "team", value: team },
    ]);
  }, [positions, team]);

  const playersList = usePlayersToDisplay(players, punts, showSmartScores);
  const selectedPlayers = useSelectedPlayers(selectPlayerIds, playersList);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: "total", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const playersTable = useReactTable<Player>({
    columns,
    data: playersList,
    getRowId: (row) => row.id.toString(),
    state: {
      rowSelection: selectPlayerIds,
      columnVisibility,
      sorting,
      columnFilters,
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setSelectPlayerIds,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className="w-full">
      <ScrollSync>
        <Table className="shadow-md min-w-full" style={{ fontSize: "13px" }}>
          <ScrollSyncPane>
            <TableHeader
              className="sticky top-0 z-10 overflow-x-scroll"
              style={{ scrollbarWidth: "none" }}
            >
              {playersTable.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  className="border-l border-slate-300"
                  key={headerGroup.id}
                  style={{ height: 50 }}
                >
                  <TableHead className="p-0">
                    <RankingsHeaderCell
                      text="#"
                      label="Row #"
                      width="60px"
                      disableCursor
                    />
                  </TableHead>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={`${headerGroup.id}-${header.id}`}
                      className={cn(
                        "border-slate-300 p-0",
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
          </ScrollSyncPane>
          <ScrollSyncPane>
            <TableBody
              className="border-l border-slate-200 overflow-x-scroll"
              style={{ scrollbarWidth: "none" }}
            >
              {playersTable.getRowModel().rows.map((row, index) => {
                return (
                  <TableRow key={row.id} className="h-10 odd:bg-slate-50/60">
                    <TableTd
                      className="p-2 text-slate-400 font-mono"
                      width="60px"
                    >
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={row.getToggleSelectedHandler()}
                      />
                      {!totalsMode && (
                        <div className="pl-1">
                          {(index + 1).toString().padStart(3, "0")}
                        </div>
                      )}
                    </TableTd>
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
          </ScrollSyncPane>
          {totalsMode && (
            <RankingsTableFooter
              selectedPlayers={selectedPlayers}
              showSmartScores={showSmartScores}
              showDraftColumns={showDraftColumns}
            />
          )}
        </Table>
      </ScrollSync>
    </div>
  );
};
const RankingsTable = memo(RankingsTable_);

export default RankingsTable;
