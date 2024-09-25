"use client";

import { Fragment, memo, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  IconPointFilled,
  IconCurrencyDollar,
  IconShirtSport,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { calculateStatPercentiles, getNStats, getStats } from "@/data/stats";
import useSelectedPlayers from "@/hooks/useSelectedPlayers";
import usePlayersToDisplay from "@/hooks/usePlayersToDisplay";
import PlayerCell from "./RankingsTablePlayerCell";
import PlayerRows from "./RankingsTablePlayerRows";
import RankingsTableFooter from "./RankingsTableFooter";
import RankingsTableHeader from "./RankingsTableHeader";
import {
  cellWidthLg,
  cellWidthMd,
  cellWidthSm,
  cellWidthXl,
  RankingsHeaderCell,
  TableTd,
} from "./RankingsTableUtils";
import TeamLogo from "../../team/TeamLogo";
import { Team } from "@/types/teamTypes";
import { Player } from "@/types/playerTypes";
import Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Table, TableBody } from "@/components/ui/table";
import PlayerPositionBadges from "@/components/player/PlayerPositionBadges";
import exportToCsv from "@/utils/csv";

/*
 * RANKINGS TABLE
 */
interface RankingsTableProps {
  players: Player[];
  isCurrentSeason: boolean;
  showSmartScores: boolean;
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
  isCurrentSeason,
  showSmartScores,
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
            text={
              <Image
                src="/img/sources/hashtag.png"
                width={15}
                height={15}
                alt="Hashtag Basketball"
              />
            }
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
            className="w-64 min-w-64"
          />
        ),
        cell: ({ row }) => {
          return (
            <PlayerCell
              player={row.original}
              showPlayerCard={isCurrentSeason}
            />
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
            ${(p.getValue() as number).toFixed(1)}
          </TableTd>
        ),
      },
      {
        accessorKey: "positions",
        header: ({ column }) => (
          <RankingsHeaderCell
            text="Pos"
            label="Position"
            width={cellWidthLg}
            sort={column.getIsSorted()}
          />
        ),
        cell: ({ row }) => (
          <TableTd
            width={cellWidthLg}
            className="overflow-scroll hide-scrollbar"
          >
            <PlayerPositionBadges positions={row.original.positions} />
          </TableTd>
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
  }, [showSmartScores, getPercentileColor, isCurrentSeason]);

  useEffect(() => {
    setColumnVisibility({ auctionValuedAt: isCurrentSeason });
  }, [players, isCurrentSeason]);

  useEffect(() => {
    setColumnFilters([
      { id: "positions", value: positions },
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
    <div className="w-full overflow-x-scroll hide-scrollbar">
      <div className="flex justify-between w-100 mb-4">
        <h2 className="text-lg font-medium pl-1">
          {isCurrentSeason
            ? "2024-2025 Season Projections"
            : "2023-2024 Season Rankings"}
        </h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => exportToCsv(playersTable.getFilteredRowModel().rows)}
        >
          Export to CSV
        </Button>
      </div>
      <Table
        className="shadow-md w-max min-w-full"
        style={{ fontSize: "13px" }}
      >
        <RankingsTableHeader playersTable={playersTable} />
        <TableBody
          className="border-l border-b border-slate-300 overflow-x-scroll hide-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          <PlayerRows playersTable={playersTable} totalsMode={totalsMode} />
        </TableBody>
        {totalsMode && (
          <RankingsTableFooter
            selectedPlayers={selectedPlayers}
            showSmartScores={showSmartScores}
            showDraftColumns={isCurrentSeason}
          />
        )}
      </Table>
    </div>
  );
};
const RankingsTable = memo(RankingsTable_);

export default RankingsTable;
