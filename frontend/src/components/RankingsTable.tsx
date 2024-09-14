"use client";

import { ReactNode, memo, useEffect, useMemo, useState } from "react";
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
  VisibilityState,
  flexRender,
  getCoreRowModel,
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
import PlayerHeadshot from "./player/PlayerHeadshot";
import TeamLogo from "./team/TeamLogo";

// CONSTANTS
const cellWidthSm = "50px";
const cellWidthMd = "65px";
const cellWidthLg = "125px";
const cellHeight = 10;

const colProps = {
  borderX: "1px",
  borderColor: "gray.100",
};

const headerColProps = {
  ...colProps,
  borderColor: "gray.300",
};

/*
 * TABLE CELL COMPONENTS
 */
const TableTd_ = ({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any; // eslint-disable-line
}) => (
  <Td px={2} py={1} {...props}>
    <Flex justify="center" align="center">
      {children}
    </Flex>
  </Td>
);
const TableTd = memo(TableTd_);

/*
 * RANKINGS HEADER CELL
 */
const RankingsHeaderCell_ = ({
  id,
  label,
  text,
}: {
  id?: string;
  label: string;
  text: string;
}) => {
  const calcHeaderSortColor = (key: string) => {
    if (key === "") return "gray.300";
    // TODO: add sort color
    return "gray.300";
  };

  return (
    <Td {...headerColProps} p={0} backgroundColor="gray.200">
      <Flex direction="column" justify="center" align="center">
        <Box
          height={3}
          width="100%"
          backgroundColor={
            calcHeaderSortColor
              ? calcHeaderSortColor(id || "default")
              : "gray.300"
          }
        />
        <Tooltip label={label} hasArrow placement="top">
          <Box my={2} fontWeight={700}>
            {text}
          </Box>
        </Tooltip>
      </Flex>
    </Td>
  );
};
const RankingsHeaderCell = memo(RankingsHeaderCell_);

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
  setIsLoaded: (value: boolean) => void;
  showSmartScores: boolean;
  showHighlights: boolean;
  punts: string[];
}

const RankingsTable_ = ({
  players,
  usePastYearStats,
  setIsLoaded,
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
        header: () => (
          <RankingsHeaderCell
            text="Rank"
            label="Rank (from Hashtag Basketball)"
          />
        ),
        cell: (p) => <TableTd>{p.getValue() as number}</TableTd>,
      },
      {
        accessorKey: "auctionValuedAt",
        header: () => <RankingsHeaderCell text="$" label="Auction Value" />,
        cell: (p) => <TableTd>${(p.getValue() as number).toFixed(1)}</TableTd>,
      },
      {
        id: "team",
        accessorFn: (player) => (u ? player.pastYearTeam : player.team),
        header: () => <RankingsHeaderCell text="Team" label="Team" />,
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
        header: () => <RankingsHeaderCell text="Player" label="Player Name" />,
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
        header: () => <RankingsHeaderCell text="Age" label="Age" />,
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
        header: () => <RankingsHeaderCell text="GP" label="Games Played" />,
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
        header: () => (
          <RankingsHeaderCell text="MPG" label="Minutes Per Game" />
        ),
        cell: (p) => (
          <TableTd fontWeight={500}>
            {(p.getValue() as number).toFixed(1)}
          </TableTd>
        ),
      },
      {
        id: "fg",
        header: () => <RankingsHeaderCell text="FG" label="Field Goal %" />,
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
        header: () => <RankingsHeaderCell text="FT" label="Free Throw %" />,
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
        header: () => <RankingsHeaderCell text="3PM" label="3-Pointers Made" />,
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
        header: () => <RankingsHeaderCell text="PTS" label="Points" />,
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
        header: () => <RankingsHeaderCell text="REB" label="Rebounds" />,
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
        header: () => <RankingsHeaderCell text="AST" label="Assists" />,
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
        header: () => <RankingsHeaderCell text="STL" label="Steals" />,
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
        header: () => <RankingsHeaderCell text="BLK" label="Blocks" />,
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
        header: () => <RankingsHeaderCell text="TO" label="Turnovers" />,
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
      },
      {
        id: "total",
        accessorFn: (player) =>
          u
            ? totalCategories(
                player.pastYearNScores
                  ? player.pastYearNScores
                  : EMPTY_PLAYER_STATS_NSCORE,
                punts
              )
            : totalCategories(
                player.projectionNScores
                  ? player.projectionNScores
                  : EMPTY_PLAYER_STATS_NSCORE,
                punts
              ),
        header: () => (
          <RankingsHeaderCell text="Total" label="Total Smart Score" />
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
    if (players.length > 0) setIsLoaded(true);
  }, [u, setIsLoaded, players]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // const [sorting, setSorting] = useState<SortingState>([]);

  const playersTable = useReactTable<Player>({
    columns,
    data: players,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
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
        <Box as="colgroup">
          <Box as="col" {...colProps} width={cellWidthSm} />
          <Box as="col" {...colProps} width={cellWidthSm} />
          {!u && <Box as="col" {...colProps} width={cellWidthMd} />}
          <Box as="col" {...colProps} width={cellWidthMd} />
          <Box as="col" {...colProps} width="260px" />
          <Box as="col" {...colProps} width={cellWidthSm} />
          <Box as="col" {...colProps} width={cellWidthSm} />
          <Box as="col" {...colProps} width={cellWidthSm} />
          <Box as="col" {...colProps} width={ss ? cellWidthMd : cellWidthLg} />
          <Box as="col" {...colProps} width={ss ? cellWidthMd : cellWidthLg} />
          <Box as="col" {...colProps} width={cellWidthMd} />
          <Box as="col" {...colProps} width={cellWidthMd} />
          <Box as="col" {...colProps} width={cellWidthMd} />
          <Box as="col" {...colProps} width={cellWidthMd} />
          <Box as="col" {...colProps} width={cellWidthMd} />
          <Box as="col" {...colProps} width={cellWidthMd} />
          <Box as="col" {...colProps} width={cellWidthMd} />
          <Box as="col" {...colProps} width={cellWidthMd} />
        </Box>
        <Thead>
          {playersTable.getHeaderGroups().map((headerGroup) => (
            <Tr {...headerColProps} key={headerGroup.id}>
              <RankingsHeaderCell key={headerGroup.id} text="#" label="Row #" />
              {headerGroup.headers.map((header) =>
                flexRender(header.column.columnDef.header, {
                  ...header.getContext(),
                  key: `${header.id}-${header.index}`,
                })
              )}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {playersTable.getRowModel().rows.map((row) => {
            return (
              <Tr
                key={row.id}
                height={cellHeight}
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
