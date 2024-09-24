import { memo, ReactNode } from "react";
import { SortDirection } from "@tanstack/react-table";
import { TableCell } from "@/components/ui/table";
import Tooltip from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const cellWidthSm = "47.5px";
export const cellWidthMd = "52.5px";
export const cellWidthLg = "80px";
export const cellWidthXl = "120px";

export const colStyles = "border-r border-slate-200";
export const headerColStyles = cn(colStyles, "border-slate-300 bg-slate-200");

/*
 * TABLE CELL COMPONENTS
 */
const TableTd_ = ({
  children,
  className,
  width,
}: {
  children?: ReactNode;
  className?: string;
  width?: string | number;
}) => (
  <TableCell
    style={{ minWidth: width, width: width }}
    className={cn("px-1.5 py-1 last:border-r-slate-300", className, colStyles)}
  >
    <div className="flex flex-row flex-grow justify-center items-center">
      {children}
    </div>
  </TableCell>
);
export const TableTd = memo(TableTd_);

/*
 * RANKINGS HEADER CELL
 */
interface RankingsHeaderCellProps {
  id?: string;
  label: string;
  text: string | ReactNode;
  width?: string;
  sort?: false | SortDirection;
  className?: string;
  disableCursor?: boolean;
}

const RankingsHeaderCell_ = ({
  id,
  label,
  text,
  width,
  sort = false,
  className,
  disableCursor = false,
}: RankingsHeaderCellProps) => {
  const calcHeaderSortColor = (sort: false | SortDirection) => {
    if (sort === "asc") return "bg-orange-200";
    if (sort === "desc") return "bg-teal-200";
    return "bg-slate-300";
  };

  return (
    <div
      key={id}
      className={cn(
        "flex flex-col h-full flex-grow justify-start items-center border-y hover:bg-slate-150",
        className,
        headerColStyles
      )}
      style={{ height: 50, minWidth: width, width: width }}
    >
      <div className={cn("top-bar h-3 w-full", calcHeaderSortColor(sort))} />
      <div className="flex flex-grow items-center">
        <Tooltip label={label}>
          <div
            className={cn(
              disableCursor && "!cursor-default",
              "my-2 font-semibold"
            )}
          >
            {text}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
export const RankingsHeaderCell = memo(RankingsHeaderCell_);
