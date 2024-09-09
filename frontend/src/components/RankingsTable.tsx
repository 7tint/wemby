"use client";

import { getNStats, getStats } from "@/data/const";
import { Player } from "@/types/playerTypes";
import { Table, TableContainer, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface RankingsTableProps {
  players: Player[];
}

const RankingsTable = ({ players }: RankingsTableProps) => {
  const [playersToDisplay, setPlayersToDisplay] = useState<Player[]>([]);
  const [totalDelta, setTotalDelta] = useState(0);
  const [usePastYearStats, setUsePastYearStats] = useState(false);

  useEffect(() => {
    const playersToDisplay = players
      .filter((player) => getNStats(player, usePastYearStats))
      .sort((a, b) => {
        const aTotal = getNStats(a, usePastYearStats)?.total || 0;
        const bTotal = getNStats(b, usePastYearStats)?.total || 0;
        return bTotal - aTotal;
      });
    setPlayersToDisplay(playersToDisplay);

    const totalDelta = playersToDisplay.reduce((acc, player, i) => {
      const rankChange = Math.abs(player.rank - (i + 1));
      return acc + rankChange;
    }, 0);
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
              <Td>Hashtag Rank</Td>
              <Td>First Name</Td>
              <Td>Last Name</Td>
              <Td>Games</Td>
              <Td>FG%</Td>
              <Td>FT%</Td>
              <Td>3PM</Td>
              <Td>PTS</Td>
              <Td>REB</Td>
              <Td>AST</Td>
              <Td>STL</Td>
              <Td>BLK</Td>
              <Td>TO</Td>
              <Td>Total</Td>
            </Tr>
          </Thead>
          <Tbody>
            {playersToDisplay.map((player, i) => {
              const rankChange = -(player.rank - (i + 1));
              return (
                <Tr key={player.id}>
                  <Td>{i + 1}</Td>
                  <Td>
                    {player.rank} ({rankChange < 0 ? "" : "+"}
                    {rankChange})
                  </Td>
                  <Td>{player.firstName}</Td>
                  <Td>{player.lastName}</Td>
                  <Td>{getStats(player, usePastYearStats)?.gp}</Td>
                  <Td>{getNStats(player, usePastYearStats)?.fg.toFixed(2)}</Td>
                  <Td>{getNStats(player, usePastYearStats)?.ft.toFixed(2)}</Td>
                  <Td>{getNStats(player, usePastYearStats)?.tpm.toFixed(2)}</Td>
                  <Td>{getNStats(player, usePastYearStats)?.pts.toFixed(2)}</Td>
                  <Td>{getNStats(player, usePastYearStats)?.reb.toFixed(2)}</Td>
                  <Td>{getNStats(player, usePastYearStats)?.ast.toFixed(2)}</Td>
                  <Td>{getNStats(player, usePastYearStats)?.stl.toFixed(2)}</Td>
                  <Td>{getNStats(player, usePastYearStats)?.blk.toFixed(2)}</Td>
                  <Td>{getNStats(player, usePastYearStats)?.to.toFixed(2)}</Td>
                  <Td>
                    {getNStats(player, usePastYearStats)?.total.toFixed(2)}
                  </Td>
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
