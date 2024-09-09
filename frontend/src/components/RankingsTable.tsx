"use client";

import { Player } from "@/types/playerTypes";
import { Table, TableContainer, Tbody, Td, Thead, Tr } from "@chakra-ui/react";

interface RankingsTableProps {
  players: Player[];
}

const RankingsTable = ({ players }: RankingsTableProps) => {
  return (
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
            <Td>Projection Z-Score Total</Td>
            <Td>Past Year Z-Score Total</Td>
          </Tr>
        </Thead>
        <Tbody>
          {players.map((player, i) => {
            const rankChange = player.rank - (i + 1);
            return (
              <Tr key={player.id}>
                <Td>
                  {player.rank} ({rankChange < 0 ? "" : "+"}
                  {rankChange})
                </Td>
                <Td>{player.first_name}</Td>
                <Td>{player.last_name}</Td>
                <Td>{player.past_year_z_scores?.fg.toFixed(2)}</Td>
                <Td>{player.past_year_z_scores?.ft.toFixed(2)}</Td>
                <Td>{player.past_year_z_scores?.tpm.toFixed(2)}</Td>
                <Td>{player.past_year_z_scores?.pts.toFixed(2)}</Td>
                <Td>{player.past_year_z_scores?.reb.toFixed(2)}</Td>
                <Td>{player.past_year_z_scores?.ast.toFixed(2)}</Td>
                <Td>{player.past_year_z_scores?.stl.toFixed(2)}</Td>
                <Td>{player.past_year_z_scores?.blk.toFixed(2)}</Td>
                <Td>{player.past_year_z_scores?.to.toFixed(2)}</Td>
                <Td>{player.past_year_z_scores?.total.toFixed(2)}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default RankingsTable;
