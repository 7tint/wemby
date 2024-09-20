import { flexRender, Table } from "@tanstack/react-table";
import { TableTd } from "./RankingsTableUtils";
import RankingsTableHeader from "./RankingsTableHeader";
import { Player } from "@/types/playerTypes";
import { TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

type PlayerRowsProps = {
  playersTable: Table<Player>;
  totalsMode: boolean;
};

const PlayerRows = ({ playersTable, totalsMode }: PlayerRowsProps) => {
  const rows = playersTable.getRowModel().rows;
  const elements = [];
  for (let i = 0; i < rows.length; i++) {
    if (i % 15 === 0 && i !== 0 && !totalsMode) {
      elements.push(
        <RankingsTableHeader
          key={`header-${i}`}
          playersTable={playersTable}
          isInTableBody
        />
      );
    }
    const row = rows[i];
    elements.push(
      <TableRow key={row.id} className="h-10 odd:bg-slate-50/60">
        <TableTd className="p-2 text-slate-400 font-mono" width="60px">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={row.getToggleSelectedHandler()}
          />
          {!totalsMode && (
            <div className="pl-1">{(i + 1).toString().padStart(3, "0")}</div>
          )}
        </TableTd>
        {row.getVisibleCells().map((cell) =>
          flexRender(cell.column.columnDef.cell, {
            ...cell.getContext(),
            key: `${row.id}-${cell.id}`,
          })
        )}
      </TableRow>
    );
  }
  return elements;
};

export default PlayerRows;
