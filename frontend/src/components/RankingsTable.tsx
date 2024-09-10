"use client";

import { getNStats, getStats } from "@/data/const";
import { Player } from "@/types/playerTypes";
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
import { ReactNode } from "react";

interface RankingsTableProps {
  players: Player[];
  usePastYearStats: boolean;
}

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

const RankingsTable = ({ players, usePastYearStats }: RankingsTableProps) => {
  const u = usePastYearStats;
  const cellWidthSm = "50px";
  const cellWidthMd = "75px";
  const cellHeight = 10;

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
            <TableTdSm {...headerColProps}>
              <Tooltip label='Ranked by "Total"' hasArrow placement="top">
                R
              </Tooltip>
            </TableTdSm>
            <TableTdSm {...headerColProps}>
              <Tooltip
                label="Rank (Hashtag Basketball)"
                hasArrow
                placement="top"
              >
                H#
              </Tooltip>
            </TableTdSm>
            {!u && (
              <TableTdSm {...headerColProps}>
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
            <TableTd {...headerColProps}>
              <Tooltip label="Games Played" hasArrow placement="top">
                GP
              </Tooltip>
            </TableTd>
            <TableTd {...headerColProps}>
              <Tooltip label="Field Goal Percentage" hasArrow placement="top">
                FG%
              </Tooltip>
            </TableTd>
            <TableTd {...headerColProps}>
              <Tooltip label="Free Throw Percentage" hasArrow placement="top">
                FT%
              </Tooltip>
            </TableTd>
            <TableTd {...headerColProps}>
              <Tooltip label="Three-Point Made" hasArrow placement="top">
                3PM
              </Tooltip>
            </TableTd>
            <TableTd {...headerColProps}>
              <Tooltip label="Points" hasArrow placement="top">
                PTS
              </Tooltip>
            </TableTd>
            <TableTd {...headerColProps}>
              <Tooltip label="Rebounds" hasArrow placement="top">
                REB
              </Tooltip>
            </TableTd>
            <TableTd {...headerColProps}>
              <Tooltip label="Assists" hasArrow placement="top">
                AST
              </Tooltip>
            </TableTd>
            <TableTd {...headerColProps}>
              <Tooltip label="Steals" hasArrow placement="top">
                STL
              </Tooltip>
            </TableTd>
            <TableTd {...headerColProps}>
              <Tooltip label="Blocks" hasArrow placement="top">
                BLK
              </Tooltip>
            </TableTd>
            <TableTd {...headerColProps}>
              <Tooltip label="Turnovers" hasArrow placement="top">
                TO
              </Tooltip>
            </TableTd>
            <TableTd {...headerColProps}>
              <Tooltip label="Total Value (see info)" hasArrow placement="top">
                Total
              </Tooltip>
            </TableTd>
          </Tr>
        </Thead>
        <Tbody>
          {players.map((player, i) => {
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
