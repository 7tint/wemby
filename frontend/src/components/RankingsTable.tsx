"use client";

import { memo, ReactNode, useMemo, useState } from "react";
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
} from "@tabler/icons-react";
import { calculateStatPercentiles, getNStats, getStats } from "@/data/const";
import { Player, PlayerStats, PlayerStatsNScore } from "@/types/playerTypes";
import { Team } from "@/types/teamTypes";
import PlayerHeadshot from "./player/PlayerHeadshot";
import TeamLogo from "./team/TeamLogo";

type PlayerStatsNScoreKeys = keyof PlayerStatsNScore;
type PlayerStatsKeys = keyof PlayerStats;

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
  calcHeaderSortColor,
  requestSort,
}: {
  id?: string;
  label: string;
  text: string;
  calcHeaderSortColor?: (key: string) => string;
  requestSort?: (key: string) => void;
}) => (
  <Td
    {...headerColProps}
    cursor={requestSort ? "pointer" : "default"}
    onClick={() => {
      if (requestSort) requestSort(id || "default");
    }}
    p={0}
  >
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
        <Box my={2}>{text}</Box>
      </Tooltip>
    </Flex>
  </Td>
);
const RankingsHeaderCell = memo(RankingsHeaderCell_);

/**
 * RANKINGS TABLE HEAD
 */
interface RankingsTableHeadProps {
  sortConfig: { key: string; direction: string } | null;
  requestSort: (key: string) => void;
  usePastYearStats: boolean;
}
const RankingsTableHead_ = ({
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
      <Tr
        height={cellHeight}
        backgroundColor="gray.200"
        borderBottomColor="gray.300"
        borderBottomWidth={1}
        fontWeight="bold"
      >
        <RankingsHeaderCell text="R" label="Row #" />
        <RankingsHeaderCell
          id="rank"
          text="H#"
          label="Rank (Hashtag Basketball)"
          calcHeaderSortColor={calcHeaderSortColor}
          requestSort={requestSort}
        />
        {!u && (
          <RankingsHeaderCell
            id="auctionValuedAt"
            text="A$"
            label="Expected Auction Value (Hashtag Basketball)"
            calcHeaderSortColor={calcHeaderSortColor}
            requestSort={requestSort}
          />
        )}
        <RankingsHeaderCell text="Team" label="Pro Team" />
        <RankingsHeaderCell text="Name" label="Player Name" />
        <RankingsHeaderCell id="age" text="Age" label="Age" />
        <RankingsHeaderCell
          id="gp"
          text="GP"
          label="Games Played"
          calcHeaderSortColor={calcHeaderSortColor}
          requestSort={requestSort}
        />
        <RankingsHeaderCell
          id="mpg"
          text="MPG"
          label="Minutes Per Game"
          calcHeaderSortColor={calcHeaderSortColor}
          requestSort={requestSort}
        />
        <RankingsHeaderCell
          id="fg"
          text="FG%"
          label="Field Goal Percentage"
          calcHeaderSortColor={calcHeaderSortColor}
          requestSort={requestSort}
        />
        <RankingsHeaderCell
          id="ft"
          text="FT%"
          label="Free Throw Percentage"
          calcHeaderSortColor={calcHeaderSortColor}
          requestSort={requestSort}
        />
        <RankingsHeaderCell
          id="tpm"
          text="3PM"
          label="Three-Point Made"
          calcHeaderSortColor={calcHeaderSortColor}
          requestSort={requestSort}
        />
        <RankingsHeaderCell
          id="pts"
          text="PTS"
          label="Points"
          calcHeaderSortColor={calcHeaderSortColor}
          requestSort={requestSort}
        />
        <RankingsHeaderCell
          id="reb"
          text="REB"
          label="Rebounds"
          calcHeaderSortColor={calcHeaderSortColor}
          requestSort={requestSort}
        />
        <RankingsHeaderCell
          id="ast"
          text="AST"
          label="Assists"
          calcHeaderSortColor={calcHeaderSortColor}
          requestSort={requestSort}
        />
        <RankingsHeaderCell
          id="stl"
          text="STL"
          label="Steals"
          calcHeaderSortColor={calcHeaderSortColor}
          requestSort={requestSort}
        />
        <RankingsHeaderCell
          id="blk"
          text="BLK"
          label="Blocks"
          calcHeaderSortColor={calcHeaderSortColor}
          requestSort={requestSort}
        />
        <RankingsHeaderCell
          id="to"
          text="TO"
          label="Turnovers"
          calcHeaderSortColor={calcHeaderSortColor}
          requestSort={requestSort}
        />
        <RankingsHeaderCell
          id="default"
          text="Total"
          label="Total Value (see info)"
          calcHeaderSortColor={calcHeaderSortColor}
          requestSort={requestSort}
        />
      </Tr>
    </Thead>
  );
};
const RankingsTableHead = memo(RankingsTableHead_);

/*
 * RANKINGS TABLE
 */
interface RankingsTableProps {
  players: Player[];
  usePastYearStats: boolean;
  showSmartScores: boolean;
  showHighlights: boolean;
}

const RankingsTable_ = ({
  players,
  usePastYearStats,
  showSmartScores,
  showHighlights,
}: RankingsTableProps) => {
  const u = usePastYearStats;
  const ss = showSmartScores;

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>({ key: "total", direction: "descending" });

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      if (sortConfig && sortConfig.direction !== "none") {
        let { key } = sortConfig;
        const { direction } = sortConfig;
        let aValue, bValue: number;

        if (key === "fg") {
          if (showSmartScores) key = "fgImpact";
          else key = "fgm";
        }
        if (key === "ft") {
          if (showSmartScores) key = "ftImpact";
          else key = "ftm";
        }

        if (key === "default") {
          aValue = getNStats(a, usePastYearStats)?.total || 0;
          bValue = getNStats(b, usePastYearStats)?.total || 0;
        } else if (key === "rank") {
          if (u) {
            bValue = a.pastYearRank;
            aValue = b.pastYearRank;
          } else {
            bValue = a.rank;
            aValue = b.rank;
          }
        } else if (key === "auctionValuedAt") {
          aValue = a[key] || 0;
          bValue = b[key] || 0;
        } else {
          if (showSmartScores || key === "fg" || key === "ft") {
            aValue =
              getNStats(a, usePastYearStats)?.[key as PlayerStatsNScoreKeys] ||
              0;
            bValue =
              getNStats(b, usePastYearStats)?.[key as PlayerStatsNScoreKeys] ||
              0;
          } else {
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
  }, [players, showSmartScores, sortConfig, usePastYearStats, u]);

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

  const getPercentileColor = (stat: number, category: string) => {
    if (!showHighlights) return "transparent";
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

  const getTotalDelta = () => {
    let totalDelta = 0;
    sortedPlayers.forEach((player, i) => {
      if (i > 200) return;
      const rank = i + 1;
      totalDelta += Math.abs(rank - (u ? player.pastYearRank : player.rank));
    });
    return totalDelta;
  };

  console.log(getTotalDelta());

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
                _odd={{ backgroundColor: "gray.50" }}
              >
                <TableTd fontWeight={600}>{i + 1}</TableTd>
                <TableTd>{u ? player.pastYearRank : player.rank}</TableTd>
                {!u && (
                  <TableTd fontWeight={500} color="yellow.700">
                    ${player.auctionValuedAt?.toFixed(1)}
                  </TableTd>
                )}
                <TableTd>
                  {u ? (
                    <TeamLogo team={player.pastYearTeam as Team} size="sm" />
                  ) : (
                    <>
                      {player.team !== player.pastYearTeam && (
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
                      <TeamLogo team={player.team as Team} size="sm" />
                    </>
                  )}
                </TableTd>
                <Td pb={0}>
                  <Flex px={4} align="center" pt={1.5}>
                    <PlayerHeadshot player={player} size="sm" />
                    <Flex align="center" ml={2} mr={1} fontWeight={500}>
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
                <TableTd>{player.age}</TableTd>
                <TableTd>{playerStats.gp}</TableTd>
                <TableTd>{playerStats.mpg.toFixed(1)}</TableTd>
                <TableTd
                  backgroundColor={getPercentileColor(
                    playerStats.fgm / playerStats.fga,
                    "fg"
                  )}
                >
                  <Flex direction="column" align="center">
                    {ss ? (
                      <Box fontWeight={500}>
                        {playerNStats.fgImpact.toFixed(2)}
                      </Box>
                    ) : (
                      <Flex align="center">
                        <Box fontWeight={500}>
                          {(playerStats.fgm / playerStats.fga).toFixed(2)}
                        </Box>
                        <Box as="span" fontSize={11} ml={2}>
                          ({playerStats.fgm.toFixed(2)} /{" "}
                          {playerStats.fga.toFixed(2)})
                        </Box>
                      </Flex>
                    )}
                  </Flex>
                </TableTd>
                <TableTd
                  backgroundColor={getPercentileColor(
                    playerStats.ftm / playerStats.fta,
                    "ft"
                  )}
                >
                  <Flex direction="column" align="center">
                    {ss ? (
                      <Box fontWeight={500}>
                        {playerNStats.ftImpact.toFixed(2)}
                      </Box>
                    ) : (
                      <Flex align="center">
                        <Box fontWeight={500}>
                          {(playerStats.ftm / playerStats.fta).toFixed(2)}
                        </Box>
                        <Box as="span" fontSize={11} ml={2}>
                          ({playerStats.ftm.toFixed(2)} /{" "}
                          {playerStats.fta.toFixed(2)})
                        </Box>
                      </Flex>
                    )}
                  </Flex>
                </TableTd>
                <TableTd
                  backgroundColor={getPercentileColor(playerStats.tpm, "tpm")}
                >
                  {ss ? (
                    <Box fontWeight={500}>{playerNStats.tpm.toFixed(2)}</Box>
                  ) : (
                    <Box fontWeight={500}>{playerStats.tpm.toFixed(1)}</Box>
                  )}
                </TableTd>
                <TableTd
                  backgroundColor={getPercentileColor(playerStats.pts, "pts")}
                >
                  {ss ? (
                    <Box fontWeight={500}>{playerNStats.pts.toFixed(2)}</Box>
                  ) : (
                    <Box fontWeight={500}>{playerStats.pts.toFixed(1)}</Box>
                  )}
                </TableTd>
                <TableTd
                  backgroundColor={getPercentileColor(playerStats.reb, "reb")}
                >
                  {ss ? (
                    <Box fontWeight={500}>{playerNStats.reb.toFixed(2)}</Box>
                  ) : (
                    <Box fontWeight={500}>{playerStats.reb.toFixed(1)}</Box>
                  )}
                </TableTd>
                <TableTd
                  backgroundColor={getPercentileColor(playerStats.ast, "ast")}
                >
                  {ss ? (
                    <Box fontWeight={500}>{playerNStats.ast.toFixed(2)}</Box>
                  ) : (
                    <Box fontWeight={500}>{playerStats.ast.toFixed(1)}</Box>
                  )}
                </TableTd>
                <TableTd
                  backgroundColor={getPercentileColor(playerStats.stl, "stl")}
                >
                  {ss ? (
                    <Box fontWeight={500}>{playerNStats.stl.toFixed(2)}</Box>
                  ) : (
                    <Box fontWeight={500}>{playerStats.stl.toFixed(1)}</Box>
                  )}
                </TableTd>
                <TableTd
                  backgroundColor={getPercentileColor(playerStats.blk, "blk")}
                >
                  {ss ? (
                    <Box fontWeight={500}>{playerNStats.blk.toFixed(2)}</Box>
                  ) : (
                    <Box fontWeight={500}>{playerStats.blk.toFixed(1)}</Box>
                  )}
                </TableTd>
                <TableTd
                  backgroundColor={getPercentileColor(playerStats.to, "to")}
                >
                  {ss ? (
                    <Box fontWeight={500}>{playerNStats.to.toFixed(2)}</Box>
                  ) : (
                    <Box fontWeight={500}>{playerStats.to.toFixed(1)}</Box>
                  )}
                </TableTd>
                <TableTd fontWeight={600}>
                  {playerNStats.total.toFixed(2)}
                </TableTd>
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
