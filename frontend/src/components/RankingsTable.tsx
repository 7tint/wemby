"use client";

import { Player } from "@/types/playerTypes";
import { Table, TableContainer, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface RankingsTableProps {
  players: Player[];
}

const RankingsTable = ({ players }: RankingsTableProps) => {
  const [totalDelta, setTotalDelta] = useState(0);

  useEffect(() => {
    const totalDelta = players
      .splice(0, 200)
      .reduce((acc, player, i) => acc + (player.pastYearRank - (i + 1)), 0);
    setTotalDelta(totalDelta);
  }, [players]);

  return (
    <>
      TOTAL DELTA: {totalDelta}
      <TableContainer>
        <Table variant="striped" size="sm">
          <Thead>
            <Tr>
              <Td>Rank</Td>
              <Td>First Name</Td>
              <Td>Last Name</Td>
              <Td>FG%</Td>
              <Td>FT%</Td>
              <Td>3PM</Td>
              <Td>PTS</Td>
              <Td>REB</Td>
              <Td>AST</Td>
              <Td>STL</Td>
              <Td>BLK</Td>
              <Td>TO</Td>
              <Td>Z-Score Total</Td>
            </Tr>
          </Thead>
          <Tbody>
            {players.map((player, i) => {
              const rankChange = player.pastYearRank - (i + 1);
              return (
                <Tr key={player.id}>
                  <Td>
                    {player.pastYearRank} ({rankChange < 0 ? "" : "+"}
                    {rankChange})
                  </Td>
                  <Td>{player.firstName}</Td>
                  <Td>{player.lastName}</Td>
                  <Td>{player.pastYearZScores?.fg.toFixed(2)}</Td>
                  <Td>{player.pastYearZScores?.ft.toFixed(2)}</Td>
                  <Td>{player.pastYearZScores?.tpm.toFixed(2)}</Td>
                  <Td>{player.pastYearZScores?.pts.toFixed(2)}</Td>
                  <Td>{player.pastYearZScores?.reb.toFixed(2)}</Td>
                  <Td>{player.pastYearZScores?.ast.toFixed(2)}</Td>
                  <Td>{player.pastYearZScores?.stl.toFixed(2)}</Td>
                  <Td>{player.pastYearZScores?.blk.toFixed(2)}</Td>
                  <Td>{player.pastYearZScores?.to.toFixed(2)}</Td>
                  <Td>{player.pastYearZScores?.total.toFixed(2)}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RankingsTable;
