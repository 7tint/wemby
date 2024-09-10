"use client";

import { getNStats, getStats } from "@/data/const";
import { Player, PlayerStatsNScore } from "@/types/playerTypes";
import {
  Box,
  Flex,
  Icon,
  Image,
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
import { ReactNode, useState } from "react";

interface RankingsTableProps {
  players: Player[];
  usePastYearStats: boolean;
}

type PlayerStatsNScoreKeys = keyof PlayerStatsNScore;

const RankingsTable = ({ players, usePastYearStats }: RankingsTableProps) => {
  const u = usePastYearStats;
  const cellWidthSm = "50px";
  const cellWidthMd = "75px";
  const cellHeight = 10;

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>({ key: "total", direction: "descending" });

  const sortedPlayers = [...players].sort((a, b) => {
    if (sortConfig && sortConfig.direction !== "none") {
      const { key, direction } = sortConfig;
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
        aValue =
          getNStats(a, usePastYearStats)?.[key as PlayerStatsNScoreKeys] || 0;
        bValue =
          getNStats(b, usePastYearStats)?.[key as PlayerStatsNScoreKeys] || 0;
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

  const TableTd = ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: any;
  }) => (
    <Td px={4} {...props}>
      <Flex justifyContent="center" alignItems="center">
        {children}
      </Flex>
    </Td>
  );

  const TableTdSm = ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: any;
  }) => (
    <Td px={2} {...props}>
      <Flex justifyContent="center" alignItems="center">
        {children}
      </Flex>
    </Td>
  );

  const colProps = {
    borderX: "1px",
    borderColor: "gray.100",
  };

  const headerColProps = {
    ...colProps,
    borderColor: "gray.300",
  };

  const calcHeaderSortColor = (key: string) => {
    if (sortConfig?.key === key) {
      if (sortConfig.direction === "ascending") {
        return "orange.200";
      } else if (sortConfig.direction === "descending") {
        return "blue.200";
      }
    }
    return "gray.200";
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
          <Box as="col" {...colProps} width="290px" />
          <Box as="col" {...colProps} width={cellWidthMd} />
          <Box as="col" {...colProps} width={cellWidthMd} />
          <Box as="col" {...colProps} width={cellWidthMd} />
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
              backgroundColor={calcHeaderSortColor("default")}
            >
              <Tooltip label='Ranked by "Total"' hasArrow placement="top">
                R
              </Tooltip>
            </TableTdSm>
            <TableTdSm
              {...headerColProps}
              cursor="pointer"
              onClick={() => requestSort("rank")}
              backgroundColor={calcHeaderSortColor("rank")}
            >
              <Tooltip
                label="Rank (Hashtag Basketball)"
                hasArrow
                placement="top"
              >
                H#
              </Tooltip>
            </TableTdSm>
            {!u && (
              <TableTdSm
                {...headerColProps}
                cursor="pointer"
                onClick={() => requestSort("auctionValuedAt")}
                backgroundColor={calcHeaderSortColor("auctionValuedAt")}
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
            <TableTd {...headerColProps}>Name</TableTd>
            <TableTd
              {...headerColProps}
              cursor="pointer"
              onClick={() => requestSort("gp")}
              backgroundColor={calcHeaderSortColor("gp")}
            >
              <Tooltip label="Games Played" hasArrow placement="top">
                GP
              </Tooltip>
            </TableTd>
            <TableTd
              {...headerColProps}
              cursor="pointer"
              onClick={() => requestSort("fg")}
              backgroundColor={calcHeaderSortColor("fg")}
            >
              <Tooltip label="Field Goal Percentage" hasArrow placement="top">
                FG%
              </Tooltip>
            </TableTd>
            <TableTd
              {...headerColProps}
              cursor="pointer"
              onClick={() => requestSort("ft")}
              backgroundColor={calcHeaderSortColor("ft")}
            >
              <Tooltip label="Free Throw Percentage" hasArrow placement="top">
                FT%
              </Tooltip>
            </TableTd>
            <TableTd
              {...headerColProps}
              cursor="pointer"
              onClick={() => requestSort("tpm")}
              backgroundColor={calcHeaderSortColor("tpm")}
            >
              <Tooltip label="Three-Point Made" hasArrow placement="top">
                3PM
              </Tooltip>
            </TableTd>
            <TableTd
              {...headerColProps}
              cursor="pointer"
              onClick={() => requestSort("pts")}
              backgroundColor={calcHeaderSortColor("pts")}
            >
              <Tooltip label="Points" hasArrow placement="top">
                PTS
              </Tooltip>
            </TableTd>
            <TableTd
              {...headerColProps}
              cursor="pointer"
              onClick={() => requestSort("reb")}
              backgroundColor={calcHeaderSortColor("reb")}
            >
              <Tooltip label="Rebounds" hasArrow placement="top">
                REB
              </Tooltip>
            </TableTd>
            <TableTd
              {...headerColProps}
              cursor="pointer"
              onClick={() => requestSort("ast")}
              backgroundColor={calcHeaderSortColor("ast")}
            >
              <Tooltip label="Assists" hasArrow placement="top">
                AST
              </Tooltip>
            </TableTd>
            <TableTd
              {...headerColProps}
              cursor="pointer"
              onClick={() => requestSort("stl")}
              backgroundColor={calcHeaderSortColor("stl")}
            >
              <Tooltip label="Steals" hasArrow placement="top">
                STL
              </Tooltip>
            </TableTd>
            <TableTd
              {...headerColProps}
              cursor="pointer"
              onClick={() => requestSort("blk")}
              backgroundColor={calcHeaderSortColor("blk")}
            >
              <Tooltip label="Blocks" hasArrow placement="top">
                BLK
              </Tooltip>
            </TableTd>
            <TableTd
              {...headerColProps}
              cursor="pointer"
              onClick={() => requestSort("to")}
              backgroundColor={calcHeaderSortColor("to")}
            >
              <Tooltip label="Turnovers" hasArrow placement="top">
                TO
              </Tooltip>
            </TableTd>
            <TableTd
              {...headerColProps}
              cursor="pointer"
              onClick={() => requestSort("total")}
              backgroundColor={calcHeaderSortColor("total")}
            >
              <Tooltip label="Total Value (see info)" hasArrow placement="top">
                Total
              </Tooltip>
            </TableTd>
          </Tr>
        </Thead>
        <Tbody>
          {sortedPlayers.map((player, i) => {
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
                <Td pb={0}>
                  <Flex px={4} alignItems="center">
                    <Image src={player.headshot} width="45px" />
                    <Flex alignItems="center" ml={2} mr={1}>
                      {player.firstName} {player.lastName}
                    </Flex>
                    {!u &&
                      (player.pastYearStats === null ? (
                        <Tooltip label="Rookie season" hasArrow placement="top">
                          <Icon as={IconPointFilled} color="purple.400" />
                        </Tooltip>
                      ) : player.rank === player.pastYearRank ? (
                        <Tooltip
                          label="No change in rank from last season"
                          hasArrow
                          placement="top"
                        >
                          <Icon as={IconEqual} color="blue.400" />
                        </Tooltip>
                      ) : player.rank > player.pastYearRank ? (
                        <Tooltip
                          label="Rank decreased from last season"
                          hasArrow
                          placement="top"
                        >
                          <Icon as={IconArrowDown} color="red.400" />
                        </Tooltip>
                      ) : (
                        <Tooltip
                          label="Rank increased from last season"
                          hasArrow
                          placement="top"
                        >
                          <Icon as={IconArrowUp} color="green.400" />
                        </Tooltip>
                      ))}
                  </Flex>
                </Td>
                <TableTd>{getStats(player, u)?.gp}</TableTd>
                <TableTd>{getNStats(player, u)?.fg.toFixed(2)}</TableTd>
                <TableTd>{getNStats(player, u)?.ft.toFixed(2)}</TableTd>
                <TableTd>{getNStats(player, u)?.tpm.toFixed(2)}</TableTd>
                <TableTd>{getNStats(player, u)?.pts.toFixed(2)}</TableTd>
                <TableTd>{getNStats(player, u)?.reb.toFixed(2)}</TableTd>
                <TableTd>{getNStats(player, u)?.ast.toFixed(2)}</TableTd>
                <TableTd>{getNStats(player, u)?.stl.toFixed(2)}</TableTd>
                <TableTd>{getNStats(player, u)?.blk.toFixed(2)}</TableTd>
                <TableTd>{getNStats(player, u)?.to.toFixed(2)}</TableTd>
                <TableTd>{getNStats(player, u)?.total.toFixed(2)}</TableTd>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default RankingsTable;
