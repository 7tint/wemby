import { useMemo } from "react";
import { flexRender, Table } from "@tanstack/react-table";
import {
  cellWidthMd,
  cellWidthSm,
  cellWidthXl,
  TableTd,
} from "./RankingsTableUtils";
import RankingsTableHeader from "./RankingsTableHeader";
import { Player } from "@/types/playerTypes";
import { MemoizedTableRow } from "@/components/ui/table";
import { calculateStatPercentiles, getStats } from "@/data/stats";

type PlayerRowsProps = {
  playersTable: Table<Player>;
  totalsMode: boolean;
  punts: Set<string>;
  showHighlights: boolean;
  showSmartScores: boolean;
};

const PlayerRows = ({
  playersTable,
  totalsMode,
  punts,
  showHighlights,
  showSmartScores,
}: PlayerRowsProps) => {
  const rows = playersTable.getRowModel().rows;

  const elements = useMemo(() => {
    const CATEGORY_COL_IDS = [
      "fg",
      "ft",
      "tpm",
      "pts",
      "reb",
      "ast",
      "stl",
      "blk",
      "to",
    ];

    const getPercentileColor = (stat: number, category: string) => {
      if (!showHighlights) return "bg-transparent";
      if (punts.has(category)) return "bg-slate-150";
      const percentile = calculateStatPercentiles(stat, category);
      switch (percentile) {
        case 0:
          return "bg-red-300";
        case 1:
          return "bg-red-200";
        case 3:
          return "bg-emerald-200";
        case 4:
          return "bg-emerald-300";
        default:
          return "bg-transparent";
      }
    };

    const elems = [];
    for (let i = 0; i < rows.length; i++) {
      if (i % 12 === 0 && i !== 0 && !totalsMode) {
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
          {!totalsMode && (
            <TableTd
              className="py-2 text-slate-400 font-mono"
              width={cellWidthSm}
            >
              <div>{(i + 1).toString().padStart(3, "0")}</div>
            </TableTd>
          )}
          {row.getVisibleCells().map((cell) => {
            if (CATEGORY_COL_IDS.includes(cell.column.id)) {
              const playerStats = getStats(row.original);
              let statNum;
              switch (cell.column.id) {
                case "fg":
                  statNum = playerStats.fgm / playerStats.fga;
                  break;
                case "ft":
                  statNum = playerStats.ftm / playerStats.fta;
                  break;
                default:
                  statNum =
                    playerStats[cell.column.id as keyof typeof playerStats];
              }

              return (
                <TableTd
                  key={`${row.id}-${cell.column.id}`}
                  className={getPercentileColor(statNum, cell.column.id)}
                  width={
                    showSmartScores
                      ? cellWidthMd
                      : cell.column.id === "fg" || cell.column.id === "ft"
                      ? cellWidthXl
                      : cellWidthMd
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableTd>
              );
            } else {
              return flexRender(cell.column.columnDef.cell, {
                ...cell.getContext(),
                key: `${row.id}-${cell.column.id}`,
              });
            }
          })}
        </MemoizedTableRow>
      );
    }
    return elems;
  }, [rows, totalsMode, playersTable, punts, showHighlights, showSmartScores]);

  return elements;
};

export default PlayerRows;
