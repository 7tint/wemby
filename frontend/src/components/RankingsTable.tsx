"use client";

import { getNStats, getStats } from "@/data/const";
import { Player } from "@/types/playerTypes";
import {
  Box,
  Flex,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
} from "@chakra-ui/react";

interface RankingsTableProps {
  players: Player[];
  usePastYearStats: boolean;
}

const TableTd = ({ children }: { children: React.ReactNode }) => (
  <Td px={4}>
    <Flex justifyContent="center">{children}</Flex>
  </Td>
);

const TableTdSm = ({ children }: { children: React.ReactNode }) => (
  <Td px={2}>
    <Flex justifyContent="center">{children}</Flex>
  </Td>
);

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
      >
        <colgroup>
          <col width={cellWidthSm}></col>
          <col width={cellWidthSm}></col>
          <col width="290px"></col>
          <col width={cellWidthMd}></col>
          <col width={cellWidthMd}></col>
          <col width={cellWidthMd}></col>
          <col width={cellWidthMd}></col>
          <col width={cellWidthMd}></col>
          <col width={cellWidthMd}></col>
          <col width={cellWidthMd}></col>
          <col width={cellWidthMd}></col>
          <col width={cellWidthMd}></col>
          <col width={cellWidthMd}></col>
          <col width={cellWidthMd}></col>
        </colgroup>
        <Thead>
          <Tr
            height={cellHeight}
            backgroundColor="gray.200"
            fontWeight="bold"
            borderBottomColor="gray.300"
            borderBottomWidth={2}
          >
            <TableTdSm>R</TableTdSm>
            <TableTdSm>H# R</TableTdSm>
            <TableTd>Name</TableTd>
            <TableTd>GP</TableTd>
            <TableTd>FG%</TableTd>
            <TableTd>FT%</TableTd>
            <TableTd>3PM</TableTd>
            <TableTd>PTS</TableTd>
            <TableTd>REB</TableTd>
            <TableTd>AST</TableTd>
            <TableTd>STL</TableTd>
            <TableTd>BLK</TableTd>
            <TableTd>TO</TableTd>
            <TableTd>Total</TableTd>
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
                <Td pb={0} minWidth="260px">
                  <Flex px={4}>
                    <Image src={player.headshot} width="45px" />
                    <Flex alignItems="center" ml={2}>
                      {player.firstName} {player.lastName}
                    </Flex>
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
