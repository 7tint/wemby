import { flexRender, Table } from "@tanstack/react-table";
import { TableTd } from "./RankingsTableUtils";
import RankingsTableHeader from "./RankingsTableHeader";
import { Player } from "@/types/playerTypes";
import { MemoizedTableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo } from "react";

type PlayerRowsProps = {
  playersTable: Table<Player>;
  totalsMode: boolean;
};

const PlayerRows = ({ playersTable, totalsMode }: PlayerRowsProps) => {
  const rows = playersTable.getRowModel().rows;

  const elements = useMemo(() => {
    const elems = [];
    for (let i = 0; i < rows.length; i++) {
      if (i % 15 === 0 && i !== 0 && !totalsMode) {
        elems.push(
          <RankingsTableHeader
            key={`header-${i}`}
            playersTable={playersTable}
            isInTableBody
          />
        );
      }
      const row = rows[i];
      elems.push(
        <MemoizedTableRow key={row.id} className="h-10 odd:bg-slate-50/60">
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
        </MemoizedTableRow>
      );
    }
    return elems;
  }, [rows, totalsMode, playersTable]); // Dependencies for useMemo

  return elements;
};

export default PlayerRows;
