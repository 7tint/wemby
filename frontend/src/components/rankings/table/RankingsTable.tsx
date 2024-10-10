"use client";

import {
  Dispatch,
  Fragment,
  memo,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { IconCurrencyDollar, IconShirtSport } from "@tabler/icons-react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  RowSelectionState,
  OnChangeFn,
  VisibilityState,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { getNStats, getStats } from "@/data/stats";
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
import { Button } from "@/components/ui/button";
import { Table, TableBody } from "@/components/ui/table";
import PlayerPositionBadges from "@/components/player/PlayerPositionBadges";
import exportToCsv from "@/utils/csv";
import CustomFeature from "./customStates";

interface RankingsTableProps {
  players: Player[];
  isCurrentSeason: boolean;
  showHighlights: boolean;
  setShowHighlights: Dispatch<SetStateAction<boolean>>;
  showSmartScores: boolean;
  setShowSmartScores: Dispatch<SetStateAction<boolean>>;
  punts: Set<string>;
  positions: string[];
  team: Team | null;
  selectPlayerIds: RowSelectionState;
  setSelectPlayerIds: OnChangeFn<RowSelectionState>;
  totalsMode?: boolean;
  favouritesOnly: boolean;
}

const RankingsTable_ = ({
  players,
  isCurrentSeason,
  showHighlights,
  setShowHighlights,
  showSmartScores,
  setShowSmartScores,
  punts,
  positions,
  team,
  selectPlayerIds,
  setSelectPlayerIds,
  totalsMode = false,
  favouritesOnly,
}: RankingsTableProps) => {
  const columns = useMemo<ColumnDef<Player>[]>(() => {
    const getDisplayValue = (player: Player) => {
      return showSmartScores ? getNStats(player) : getStats(player);
    };
    const f = showSmartScores ? 2 : 1;

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
              {/* TODO: Changed teams */}
              {/* {row.original.changedTeams && (
                <Tooltip label="Changing teams this season">
                  <IconPointFilled className="text-pink-400 pr-1" size={18} />
                </Tooltip>
              )} */}
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
            className="w-52 min-w-52"
          />
        ),
        cell: ({ row }) => (
          <PlayerCell player={row.original} showPlayerCard={isCurrentSeason} />
        ),
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
                    ({playerStats.fgm.toFixed(2)} / {playerStats.fga.toFixed(2)}
                    )
                  </span>
                </div>
              )}
            </div>
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
                    ({playerStats.ftm.toFixed(2)} / {playerStats.fta.toFixed(2)}
                    )
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        id: "tpm",
        accessorFn: (player) => getDisplayValue(player).tpm.toFixed(f),
        header: ({ column }) => (
          <RankingsHeaderCell
            text="3PM"
            label="3-Pointers Made"
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        sortDescFirst: true,
      },
      {
        id: "pts",
        accessorFn: (player) => getDisplayValue(player).pts.toFixed(f),
        header: ({ column }) => (
          <RankingsHeaderCell
            text="PTS"
            label="Points"
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        sortDescFirst: true,
      },
      {
        id: "reb",
        accessorFn: (player) => getDisplayValue(player).reb.toFixed(f),
        header: ({ column }) => (
          <RankingsHeaderCell
            text="REB"
            label="Rebounds"
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        sortDescFirst: true,
      },
      {
        id: "ast",
        accessorFn: (player) => getDisplayValue(player).ast.toFixed(f),
        header: ({ column }) => (
          <RankingsHeaderCell
            text="AST"
            label="Assists"
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        sortDescFirst: true,
      },
      {
        id: "stl",
        accessorFn: (player) => getDisplayValue(player).stl.toFixed(f),
        header: ({ column }) => (
          <RankingsHeaderCell
            text="STL"
            label="Steals"
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        sortDescFirst: true,
      },
      {
        id: "blk",
        accessorFn: (player) => getDisplayValue(player).blk.toFixed(f),
        header: ({ column }) => (
          <RankingsHeaderCell
            text="BLK"
            label="Blocks"
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
        sortDescFirst: true,
      },
      {
        id: "to",
        accessorFn: (player) => getDisplayValue(player).to.toFixed(f),
        header: ({ column }) => (
          <RankingsHeaderCell
            text="TO"
            label="Turnovers"
            width={cellWidthMd}
            sort={column.getIsSorted()}
          />
        ),
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
        sortDescFirst: true,
      },
    ];
  }, [showSmartScores, isCurrentSeason]);

  const playersList = usePlayersToDisplay(
    players,
    punts,
    showSmartScores,
    favouritesOnly
  );
  const selectedPlayers = useSelectedPlayers(selectPlayerIds, playersList);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: "total", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const playersTable = useReactTable<Player>({
    _features: [CustomFeature],
    columns,
    data: playersList,
    getRowId: (row) => row.id.toString(),
    state: {
      rowSelection: selectPlayerIds,
      columnVisibility,
      sorting,
      columnFilters,
      showHighlights,
      showSmartScores,
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setSelectPlayerIds,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onShowHighlightsChange: setShowHighlights,
    onShowSmartScoresChange: setShowSmartScores,
  });

  useEffect(() => {
    setColumnVisibility({ auctionValuedAt: isCurrentSeason });
  }, [isCurrentSeason]);

  useEffect(() => {
    setColumnFilters([
      { id: "positions", value: positions },
      { id: "team", value: team },
    ]);
  }, [positions, team]);

  return (
    <div className="w-full overflow-x-scroll hide-scrollbar">
      <div className="flex justify-between w-100 mb-4">
        <h2 className="text-lg font-medium pl-1">
          {totalsMode
            ? "Selected Players"
            : isCurrentSeason
            ? "2024-2025 Season Projections"
            : "2023-2024 Season Rankings"}
        </h2>
        <Button
          className="hidden md:block"
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
        <RankingsTableHeader
          playersTable={playersTable}
          totalsMode={totalsMode}
        />
        <TableBody
          className="border-l border-b border-slate-300 overflow-x-scroll hide-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          <PlayerRows
            playersTable={playersTable}
            totalsMode={totalsMode}
            selectedPlayers={selectedPlayers}
            punts={punts}
            showHighlights={showHighlights}
            showSmartScores={showSmartScores}
          />
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
