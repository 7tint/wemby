import { memo, ReactNode } from "react";
import { SortDirection } from "@tanstack/react-table";
import { TableCell } from "@/components/ui/table";
import Tooltip from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const cellWidthSm = "47.5px";
export const cellWidthMd = "52.5px";
export const cellWidthLg = "80px";
export const cellWidthXl = "120px";

export const colStyles = "border-r border-slate-300";
export const headerColStyles = cn(colStyles, "bg-slate-200");

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
  width?: string;
}) => (
  <TableCell
    style={{ minWidth: width, width: width }}
    className={cn("px-1.5 py-1", className, colStyles)}
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
const RankingsHeaderCell_ = ({
  id,
  label,
  text,
  width,
  sort = false,
  className,
  disableCursor = false,
}: {
  id?: string;
  label: string;
  text: string | ReactNode;
  width?: string;
  sort?: false | SortDirection;
  className?: string;
  disableCursor?: boolean;
}) => {
  const calcHeaderSortColor = (sort: false | SortDirection) => {
    if (sort === "asc") return "bg-orange-200";
    if (sort === "desc") return "bg-teal-200";
    return "bg-slate-300";
  };

  return (
    <div
      key={id}
      className={cn(
        "flex flex-col flex-grow justify-start items-center border-b border-slate-300",
        className,
        headerColStyles
      )}
      style={{ height: 50, minWidth: width, width: width }}
    >
      <div className={cn("h-3 w-full", calcHeaderSortColor(sort))} />
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
  );
};
export const RankingsHeaderCell = memo(RankingsHeaderCell_);
