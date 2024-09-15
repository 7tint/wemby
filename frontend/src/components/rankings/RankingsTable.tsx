"use client";

import { memo, useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
  headerColProps,
  RankingsColumnGroup,
  RankingsHeaderCell,
  TableTd,
} from "./RankingsTableUtils";

/*
 * RANKINGS TABLE
 */
const getPlayerTrend = (player: Player) => {
  const playerTrend =
    player.pastYearStats === null
      ? {
          color: "pink.400",
          label: "Rookie season",
          icon: IconPointFilled,
        }
      : player.rank === player.pastYearRank
      ? {
          color: "blue.400",
          label: "No change in rank from last season",
          icon: IconEqual,
        }
      : player.rank > player.pastYearRank
      ? {
          color: "red.400",
          label: "Rank decreased from last season",
          icon: IconArrowDown,
        }
      : {
          color: "green.400",
          label: "Rank increased from last season",
          icon: IconArrowUp,
        };
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

  const columns = useMemo<ColumnDef<Player>[]>(() => {
    const getPercentileColor = (stat: number, category: string) => {
      if (!showHighlights) return "transparent";
      if (punts.includes(category)) return "gray.100";
      const percentile = calculateStatPercentiles(stat, category);
      if (percentile === 0) {
        return "red.200";
      } else if (percentile === 1) {
        return "red.100";
      } else if (percentile === 2) {
        return "transparent";
      } else if (percentile === 3) {
        return "green.100";
      } else if (percentile === 4) {
        return "green.200";
      } else {
        return "transparent";
      }
    };

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
              <>
                {row.original.team !== row.original.pastYearTeam && (
                  <Tooltip
                    label="Changing teams this season"
                    hasArrow
                    placement="bottom"
                  >
                    <Icon
                      as={IconPointFilled}
                      color="pink.400"
                      pr={1}
                      boxSize={5}
                    />
                  </Tooltip>
                )}
                <TeamLogo team={row.original.team as Team} size="sm" />
              </>
            )}
          </TableTd>
        ),
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
          const playerTrend = getPlayerTrend(row.original);
          return (
            <Td pb={0}>
              <Flex px={4} align="center" pt={1.5}>
                <PlayerHeadshot player={row.original} size="sm" />
                <Flex align="center" ml={2} mr={1} pb={1} fontWeight={500}>
                  {row.original.firstName} {row.original.lastName}
                </Flex>
                {!u && (
                  <Tooltip
                    label={playerTrend.label}
                    hasArrow
                    placement="bottom"
                  >
                    <Icon as={playerTrend.icon} color={playerTrend.color} />
                  </Tooltip>
                )}
              </Flex>
            </Td>
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
        cell: (p) => (
          <TableTd fontWeight={500}>{p.getValue() as number}</TableTd>
        ),
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
        cell: (p) => (
          <TableTd fontWeight={500}>
            {(p.getValue() as number).toFixed(1)}
          </TableTd>
        ),
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
              backgroundColor={getPercentileColor(
                playerStats.fgm / playerStats.fga,
                "fg"
              )}
            >
              <Flex direction="column" align="center">
                {ss ? (
                  <Box fontWeight={500}>{playerNStats.fgImpact.toFixed(2)}</Box>
                ) : (
                  <Flex align="center">
                    <Box fontWeight={500}>
                      {playerStats.fga > 0
                        ? (playerStats.fgm / playerStats.fga).toFixed(2)
                        : (0).toFixed(2)}
                    </Box>
                    <Box as="span" fontSize={11} ml={2}>
                      ({playerStats.fgm.toFixed(2)} /{" "}
                      {playerStats.fga.toFixed(2)})
                    </Box>
                  </Flex>
                )}
              </Flex>
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
              backgroundColor={getPercentileColor(
                playerStats.ftm / playerStats.fta,
                "ft"
              )}
            >
              <Flex direction="column" align="center">
                {ss ? (
                  <Box fontWeight={500}>{playerNStats.ftImpact.toFixed(2)}</Box>
                ) : (
                  <Flex align="center">
                    <Box fontWeight={500}>
                      {playerStats.fta > 0
                        ? (playerStats.ftm / playerStats.fta).toFixed(2)
                        : (0).toFixed(2)}
                    </Box>
                    <Box as="span" fontSize={11} ml={2}>
                      ({playerStats.ftm.toFixed(2)} /{" "}
                      {playerStats.fta.toFixed(2)})
                    </Box>
                  </Flex>
                )}
              </Flex>
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
        cell: ({ cell, row }) => {
          const tpm = cell.getValue() as number;
          return (
            <TableTd
              backgroundColor={getPercentileColor(
                getStats(row.original, u).tpm,
                "tpm"
              )}
            >
              <Box fontWeight={500}>{tpm.toFixed(1)}</Box>
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
            <TableTd
              backgroundColor={getPercentileColor(pts, "pts")}
              fontWeight={500}
            >
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
            <TableTd
              backgroundColor={getPercentileColor(reb, "reb")}
              fontWeight={500}
            >
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
            <TableTd
              backgroundColor={getPercentileColor(ast, "ast")}
              fontWeight={500}
            >
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
            <TableTd
              backgroundColor={getPercentileColor(stl, "stl")}
              fontWeight={500}
            >
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
            <TableTd
              backgroundColor={getPercentileColor(blk, "blk")}
              fontWeight={500}
            >
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
            <TableTd
              backgroundColor={getPercentileColor(to, "to")}
              fontWeight={500}
            >
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
          <TableTd fontWeight={600}>
            {(cell.getValue() as number).toFixed(2)}
          </TableTd>
        ),
      },
    ];
  }, [u, ss, punts, showHighlights]);

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
    <TableContainer overflowX="scroll" minWidth="100%">
      <Table
        size="xs"
        __css={{ tableLayout: "fixed" }}
        width="max-content"
        minWidth="100%"
        borderWidth={1.5}
        borderColor="gray.300"
      >
        <RankingsColumnGroup u={u} ss={ss} />
        <Thead>
          {playersTable.getHeaderGroups().map((headerGroup) => (
            <Tr {...headerColProps} key={headerGroup.id}>
              <Td
                {...headerColProps}
                key={headerGroup.id}
                backgroundColor="gray.200"
                p={0}
              >
                <RankingsHeaderCell text="#" label="Row #" />
              </Td>
              {headerGroup.headers.map((header) => (
                <Td
                  {...headerColProps}
                  key={`${headerGroup.id}-${header.id}`}
                  backgroundColor="gray.200"
                  p={0}
                  cursor={header.column.getCanSort() ? "pointer" : "default"}
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
                </Td>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {playersTable.getRowModel().rows.map((row) => {
            return (
              <Tr
                key={row.id}
                height={10}
                _odd={{ backgroundColor: "gray.50" }}
              >
                <TableTd fontWeight={600}>{row.index + 1}</TableTd>
                {row.getVisibleCells().map((cell) =>
                  flexRender(cell.column.columnDef.cell, {
                    ...cell.getContext(),
                    key: `${row.id}-${cell.id}`,
                  })
                )}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const RankingsTable = memo(RankingsTable_);

export default RankingsTable;
