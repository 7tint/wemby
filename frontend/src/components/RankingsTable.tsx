"use client";

import { ReactNode, useEffect, useState } from "react";
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
  IconArrowUp,
  IconArrowDown,
  IconEqual,
  IconPointFilled,
  IconTag,
} from "@tabler/icons-react";
import { getNStats, getStats } from "@/data/const";
import { Player, PlayerStats, PlayerStatsNScore } from "@/types/playerTypes";
import { Team } from "@/types/teamTypes";
import PlayerHeadshot from "./player/PlayerHeadshot";
import TeamLogo from "./team/TeamLogo";

type PlayerStatsNScoreKeys = keyof PlayerStatsNScore;
type PlayerStatsKeys = keyof PlayerStats;

// CONSTANTS
const cellWidthSm = "50px";
const cellWidthMd = "75px";
const cellWidthLg = "120px";
const cellHeight = 10;

const colProps = {
  borderX: "1px",
  borderColor: "gray.100",
};

const headerColProps = {
  ...colProps,
  borderColor: "gray.300",
};

const TableTd = ({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any; // eslint-disable-line
}) => (
  <Td px={4} py={1} {...props}>
    <Flex justifyContent="center" alignItems="center">
      {children}
    </Flex>
  </Td>
);

const TableTdSm = ({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any; // eslint-disable-line
}) => (
  <Td px={2} {...props}>
    <Flex justifyContent="center" alignItems="center">
      {children}
    </Flex>
  </Td>
);

interface RankingsTableHeadProps {
  sortConfig: { key: string; direction: string } | null;
  requestSort: (key: string) => void;
  usePastYearStats: boolean;
}

const RankingsTableHead = ({
  sortConfig,
  requestSort,
  usePastYearStats,
}: RankingsTableHeadProps) => {
  const u = usePastYearStats;

  const calcHeaderSortColor = (key: string) => {
    if (sortConfig?.key === key) {
      if (sortConfig.direction === "ascending") {
        return "orange.200";
      } else if (sortConfig.direction === "descending") {
        return "teal.200";
      }
    }
    return "gray.300";
  };

  return (
    <Thead>
      <Tr height={4} backgroundColor="gray.300">
        <TableTdSm
          {...headerColProps}
          cursor="pointer"
          backgroundColor={calcHeaderSortColor("default")}
          onClick={() => requestSort("default")}
        />
        <TableTdSm
          {...headerColProps}
          cursor="pointer"
          backgroundColor={calcHeaderSortColor("rank")}
          onClick={() => requestSort("rank")}
        />
        {!u && (
          <TableTdSm
            {...headerColProps}
            cursor="pointer"
            backgroundColor={calcHeaderSortColor("auctionValuedAt")}
            onClick={() => requestSort("auctionValuedAt")}
          />
        )}
        <TableTdSm {...headerColProps} />
        <TableTd {...headerColProps} />
        <TableTd
          {...headerColProps}
          cursor="pointer"
          backgroundColor={calcHeaderSortColor("gp")}
          onClick={() => requestSort("gp")}
        />
        <TableTd
          {...headerColProps}
          cursor="pointer"
          backgroundColor={calcHeaderSortColor("fg")}
          onClick={() => requestSort("fg")}
        />
        <TableTd
          {...headerColProps}
          cursor="pointer"
          backgroundColor={calcHeaderSortColor("ft")}
          onClick={() => requestSort("ft")}
        />
        <TableTd
          {...headerColProps}
          cursor="pointer"
          backgroundColor={calcHeaderSortColor("tpm")}
          onClick={() => requestSort("tpm")}
        />
        <TableTd
          {...headerColProps}
          cursor="pointer"
          backgroundColor={calcHeaderSortColor("pts")}
          onClick={() => requestSort("pts")}
        />
        <TableTd
          {...headerColProps}
          cursor="pointer"
          backgroundColor={calcHeaderSortColor("reb")}
          onClick={() => requestSort("reb")}
        />
        <TableTd
          {...headerColProps}
          cursor="pointer"
          backgroundColor={calcHeaderSortColor("ast")}
          onClick={() => requestSort("ast")}
        />
        <TableTd
          {...headerColProps}
          cursor="pointer"
          backgroundColor={calcHeaderSortColor("stl")}
          onClick={() => requestSort("stl")}
        />
        <TableTd
          {...headerColProps}
          cursor="pointer"
          backgroundColor={calcHeaderSortColor("blk")}
          onClick={() => requestSort("blk")}
        />
        <TableTd
          {...headerColProps}
          cursor="pointer"
          backgroundColor={calcHeaderSortColor("to")}
          onClick={() => requestSort("to")}
        />
        <TableTd
          {...headerColProps}
          cursor="pointer"
          backgroundColor={calcHeaderSortColor("total")}
          onClick={() => requestSort("total")}
        />
      </Tr>
      <Tr
        height={cellHeight}
        backgroundColor="gray.200"
        borderBottomColor="gray.300"
        borderBottomWidth={1}
        fontWeight="bold"
      >
        <TableTdSm
          {...headerColProps}
          cursor="pointer"
          onClick={() => requestSort("default")}
        >
          <Tooltip label='Ranked by "Total"' hasArrow placement="top">
            R
          </Tooltip>
        </TableTdSm>
        <TableTdSm
          {...headerColProps}
          cursor="pointer"
          onClick={() => requestSort("rank")}
        >
          <Tooltip label="Rank (Hashtag Basketball)" hasArrow placement="top">
            H#
          </Tooltip>
        </TableTdSm>
        {!u && (
          <TableTdSm
            {...headerColProps}
            cursor="pointer"
            onClick={() => requestSort("auctionValuedAt")}
          >
            <Tooltip
              label="Expected Auction Value (Hashtag Basketball)"
              hasArrow
              placement="top"
            >
              <Icon as={IconTag} />
            </Tooltip>
          </TableTdSm>
        )}
        <TableTdSm {...headerColProps}>
          <TeamLogo
            team="NBA"
            size="sm"
            tooltipProps={{
              label: "Team",
              hasArrow: true,
              placement: "top",
            }}
          />
        </TableTdSm>
        <TableTd {...headerColProps}>Name</TableTd>
        <TableTd
          {...headerColProps}
          cursor="pointer"
          onClick={() => requestSort("gp")}
        >
          <Tooltip label="Games Played" hasArrow placement="top">
            GP
          </Tooltip>
        </TableTd>
        <TableTd
          {...headerColProps}
          cursor="pointer"
          onClick={() => requestSort("fg")}
        >
          <Tooltip label="Field Goal Percentage" hasArrow placement="top">
            FG%
          </Tooltip>
        </TableTd>
        <TableTd
          {...headerColProps}
          cursor="pointer"
          onClick={() => requestSort("ft")}
        >
          <Tooltip label="Free Throw Percentage" hasArrow placement="top">
            FT%
          </Tooltip>
        </TableTd>
        <TableTd
          {...headerColProps}
          cursor="pointer"
          onClick={() => requestSort("tpm")}
        >
          <Tooltip label="Three-Point Made" hasArrow placement="top">
            3PM
          </Tooltip>
        </TableTd>
        <TableTd
          {...headerColProps}
          cursor="pointer"
          onClick={() => requestSort("pts")}
        >
          <Tooltip label="Points" hasArrow placement="top">
            PTS
          </Tooltip>
        </TableTd>
        <TableTd
          {...headerColProps}
          cursor="pointer"
          onClick={() => requestSort("reb")}
        >
          <Tooltip label="Rebounds" hasArrow placement="top">
            REB
          </Tooltip>
        </TableTd>
        <TableTd
          {...headerColProps}
          cursor="pointer"
          onClick={() => requestSort("ast")}
        >
          <Tooltip label="Assists" hasArrow placement="top">
            AST
          </Tooltip>
        </TableTd>
        <TableTd
          {...headerColProps}
          cursor="pointer"
          onClick={() => requestSort("stl")}
        >
          <Tooltip label="Steals" hasArrow placement="top">
            STL
          </Tooltip>
        </TableTd>
        <TableTd
          {...headerColProps}
          cursor="pointer"
          onClick={() => requestSort("blk")}
        >
          <Tooltip label="Blocks" hasArrow placement="top">
            BLK
          </Tooltip>
        </TableTd>
        <TableTd
          {...headerColProps}
          cursor="pointer"
          onClick={() => requestSort("to")}
        >
          <Tooltip label="Turnovers" hasArrow placement="top">
            TO
          </Tooltip>
        </TableTd>
        <TableTd
          {...headerColProps}
          cursor="pointer"
          onClick={() => requestSort("total")}
        >
          <Tooltip label="Total Value (see info)" hasArrow placement="top">
            Total
          </Tooltip>
        </TableTd>
      </Tr>
    </Thead>
  );
};

interface RankingsTableProps {
  players: Player[];
  usePastYearStats: boolean;
  showSmartScores?: boolean;
}

const RankingsTable = ({
  players,
  usePastYearStats,
  showSmartScores = false,
}: RankingsTableProps) => {
  const u = usePastYearStats;
  const ss = showSmartScores;

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>({ key: "total", direction: "descending" });
  const [sortedPlayers, setSortedPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const newSortedPlayers = [...players].sort((a, b) => {
      if (sortConfig && sortConfig.direction !== "none") {
        let { key } = sortConfig;
        const { direction } = sortConfig;
        let aValue, bValue: number;

        if (key === "default") {
          aValue = getNStats(a, usePastYearStats)?.total || 0;
          bValue = getNStats(b, usePastYearStats)?.total || 0;
        } else if (key === "rank" || key === "auctionValuedAt") {
          aValue = a[key] || 0;
          bValue = b[key] || 0;
        } else if (key === "gp") {
          aValue = getStats(a, usePastYearStats)?.gp || 0;
          bValue = getStats(b, usePastYearStats)?.gp || 0;
        } else {
          if (showSmartScores) {
            aValue =
              getNStats(a, usePastYearStats)?.[key as PlayerStatsNScoreKeys] ||
              0;
            bValue =
              getNStats(b, usePastYearStats)?.[key as PlayerStatsNScoreKeys] ||
              0;
          } else {
            if (key === "fg") key = "fgm";
            if (key === "ft") key = "ftm";
            aValue =
              getStats(a, usePastYearStats)?.[key as PlayerStatsKeys] || 0;
            bValue =
              getStats(b, usePastYearStats)?.[key as PlayerStatsKeys] || 0;
          }
        }
        if (aValue < bValue) {
          return direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === "ascending" ? 1 : -1;
        }
      }
      return 0;
    });
    setSortedPlayers(newSortedPlayers);
  }, [players, showSmartScores, sortConfig, usePastYearStats]);

  const requestSort = (key: string) => {
    let direction = "none";
    if (sortConfig && sortConfig.key !== key) {
      setSortConfig({ key, direction: "descending" });
      direction = "descending";
    } else {
      if (sortConfig && sortConfig.key === key) {
        if (sortConfig.direction === "none") {
          setSortConfig({ key, direction: "descending" });
          direction = "descending";
        } else if (sortConfig.direction === "descending") {
          setSortConfig({ key, direction: "ascending" });
          direction = "ascending";
        } else {
          setSortConfig({ key, direction: "none" });
          direction = "none";
        }
      }
    }
    setSortConfig({ key, direction });
  };

  const getPlayerTrend = (player: Player) => {
    const playerTrend =
      player.pastYearStats === null
        ? {
            color: "purple.400",
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
          <Box as="col" {...colProps} width={cellWidthSm} />
          <Box as="col" {...colProps} width="280px" />
          <Box as="col" {...colProps} width={cellWidthMd} />
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
        <RankingsTableHead
          sortConfig={sortConfig}
          requestSort={requestSort}
          usePastYearStats={u}
        />
        <Tbody>
          {sortedPlayers.map((player, i) => {
            const playerTrend = getPlayerTrend(player);
            const playerNStats = getNStats(player, u)!;
            const playerStats = getStats(player, u)!;

            return (
              <Tr
                key={player.id}
                height={cellHeight}
                _odd={{ backgroundColor: "purple.50" }}
              >
                <TableTdSm>{i + 1}</TableTdSm>
                <TableTdSm>{player.rank}</TableTdSm>
                {!u && (
                  <TableTdSm>${player.auctionValuedAt?.toFixed(1)}</TableTdSm>
                )}
                <TableTdSm>
                  {u ? (
                    <TeamLogo team={player.pastYearTeam as Team} size="sm" />
                  ) : (
                    <TeamLogo team={player.team as Team} size="sm" />
                  )}
                </TableTdSm>
                <Td pb={0}>
                  <Flex px={4} alignItems="center">
                    <PlayerHeadshot player={player} size="sm" />
                    <Flex alignItems="center" ml={2} mr={1}>
                      {player.firstName} {player.lastName}
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
                <TableTd>{playerStats.gp}</TableTd>
                <TableTd>
                  <Flex direction="column" alignItems="center">
                    {ss ? (
                      <Box fontWeight={500}>{playerNStats.fg.toFixed(2)}</Box>
                    ) : (
                      <Flex alignItems="center">
                        <Box fontWeight={500}>
                          {playerStats.fgPct.toFixed(2)}
                        </Box>
                        <Box as="span" fontSize={11} ml={2}>
                          ({playerStats.fgm.toFixed(2)} /{" "}
                          {playerStats.fga.toFixed(2)})
                        </Box>
                      </Flex>
                    )}
                  </Flex>
                </TableTd>
                <TableTd>
                  <Flex direction="column" alignItems="center">
                    {ss ? (
                      <Box fontWeight={500}>{playerNStats.ft.toFixed(2)}</Box>
                    ) : (
                      <Flex alignItems="center">
                        <Box fontWeight={500}>
                          {playerStats.ftPct.toFixed(2)}
                        </Box>
                        <Box as="span" fontSize={11} ml={2}>
                          ({playerStats.ftm.toFixed(2)} /{" "}
                          {playerStats.fta.toFixed(2)})
                        </Box>
                      </Flex>
                    )}
                  </Flex>
                </TableTd>
                <TableTd>
                  {ss ? (
                    <Box fontWeight={500}>{playerNStats.tpm.toFixed(2)}</Box>
                  ) : (
                    <Box fontWeight={500}>{playerStats.tpm.toFixed(1)}</Box>
                  )}
                </TableTd>
                <TableTd>
                  {ss ? (
                    <Box fontWeight={500}>{playerNStats.pts.toFixed(2)}</Box>
                  ) : (
                    <Box fontWeight={500}>{playerStats.pts.toFixed(1)}</Box>
                  )}
                </TableTd>
                <TableTd>
                  {ss ? (
                    <Box fontWeight={500}>{playerNStats.reb.toFixed(2)}</Box>
                  ) : (
                    <Box fontWeight={500}>{playerStats.reb.toFixed(1)}</Box>
                  )}
                </TableTd>
                <TableTd>
                  {ss ? (
                    <Box fontWeight={500}>{playerNStats.ast.toFixed(2)}</Box>
                  ) : (
                    <Box fontWeight={500}>{playerStats.ast.toFixed(1)}</Box>
                  )}
                </TableTd>
                <TableTd>
                  {ss ? (
                    <Box fontWeight={500}>{playerNStats.stl.toFixed(2)}</Box>
                  ) : (
                    <Box fontWeight={500}>{playerStats.stl.toFixed(1)}</Box>
                  )}
                </TableTd>
                <TableTd>
                  {ss ? (
                    <Box fontWeight={500}>{playerNStats.blk.toFixed(2)}</Box>
                  ) : (
                    <Box fontWeight={500}>{playerStats.blk.toFixed(1)}</Box>
                  )}
                </TableTd>
                <TableTd>
                  {ss ? (
                    <Box fontWeight={500}>{playerNStats.to.toFixed(2)}</Box>
                  ) : (
                    <Box fontWeight={500}>{playerStats.to.toFixed(1)}</Box>
                  )}
                </TableTd>
                <TableTd>{playerNStats.total.toFixed(2)}</TableTd>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default RankingsTable;
