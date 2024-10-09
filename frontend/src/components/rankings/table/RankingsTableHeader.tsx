import { flexRender, Table } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  cellWidthLg,
  cellWidthSm,
  RankingsHeaderCell,
} from "./RankingsTableUtils";
import { Player } from "@/types/playerTypes";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RankingsTableHeaderProps {
  playersTable: Table<Player>;
  isInTableBody?: boolean;
  totalsMode?: boolean;
}

const RankingsTableHeader = ({
  playersTable,
  isInTableBody = false,
  totalsMode = false,
}: RankingsTableHeaderProps) => {
  return (
    <TableHeader>
      {playersTable.getHeaderGroups().map((headerGroup) => (
        <TableRow
          className={isInTableBody ? "" : "border-l border-slate-300"}
          key={headerGroup.id}
          style={{ height: isInTableBody ? 36 : 50 }}
        >
          {!totalsMode && (
            <TableHead
              className={cn("p-0", isInTableBody ? "disable-top-bar" : "")}
            >
              <RankingsHeaderCell
                text="#"
                label="Row #"
                width={cellWidthSm}
                disableCursor
              />
            </TableHead>
          )}
          {headerGroup.headers.map((header) => (
            <TableHead
              key={`${headerGroup.id}-${header.id}`}
              className={cn(
                "border-slate-300 p-0",
                header.column.getCanSort() ? "cursor-pointer" : "cursor-auto",
                isInTableBody ? "disable-top-bar" : ""
              )}
              onClick={header.column.getToggleSortingHandler()}
              title={
                header.column.getCanSort()
                  ? header.column.getNextSortingOrder() === "asc"
                    ? "Sort ascending"
                    : header.column.getNextSortingOrder() === "desc"
                    ? "Sort descending"
                    : "Clear sort"
                  : undefined
              }
            >
              {flexRender(header.column.columnDef.header, {
                ...header.getContext(),
              })}
            </TableHead>
          ))}
          <TableHead
            className={cn("p-0", isInTableBody ? "disable-top-bar" : "")}
          >
            <RankingsHeaderCell
              text="Action"
              label="Compare and Save Players"
              width={cellWidthLg}
              disableCursor
            />
          </TableHead>
        </TableRow>
      ))}
    </TableHeader>
  );
};

export default RankingsTableHeader;
