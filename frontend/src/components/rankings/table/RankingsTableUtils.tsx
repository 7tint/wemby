import { memo, ReactNode } from "react";
import { SortDirection } from "@tanstack/react-table";
import { TableCell } from "@/components/ui/table";
import Tooltip from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const cellWidthSm = "47.5px";
export const cellWidthMd = "55px";
export const cellWidthLg = "80px";
export const cellWidthXl = "120px";

export const colStyles = "border border-slate-300";
export const headerColStyles = cn(colStyles, "bg-slate-200");

/*
 * TABLE CELL COMPONENTS
 */
const TableTd_ = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <TableCell className={cn("px-2 py-1", className)}>
    <div className="flex flex-row justify-center items-center">{children}</div>
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
  sort = false,
  className,
  disableCursor = false,
}: {
  id?: string;
  label: string;
  text: string | ReactNode;
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
      className={cn("flex flex-col justify-start items-center", className)}
      style={{ height: 50 }}
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

/*
 * RANKINGS COLUMNS
 */
const RankingsColumnGroup_ = ({
  showDraftColumns,
  showSmartScores,
}: {
  showDraftColumns: boolean;
  showSmartScores: boolean;
}) => (
  <colgroup>
    <col className={cn(colStyles)} />
    <col className={colStyles} width={cellWidthSm} />
    {showDraftColumns && <col className={colStyles} width={cellWidthMd} />}
    <col className={colStyles} width={cellWidthSm} />
    <col className={cn(colStyles, "w-fit min-w-52")} />
    <col className={colStyles} width={cellWidthSm} />
    <col className={colStyles} width={cellWidthLg} />
    <col className={colStyles} width={cellWidthSm} />
    <col className={colStyles} width={cellWidthSm} />
    <col
      className={colStyles}
      width={showSmartScores ? cellWidthMd : cellWidthXl}
    />
    <col
      className={colStyles}
      width={showSmartScores ? cellWidthMd : cellWidthXl}
    />
    <col className={colStyles} width={cellWidthMd} />
    <col className={colStyles} width={cellWidthMd} />
    <col className={colStyles} width={cellWidthMd} />
    <col className={colStyles} width={cellWidthMd} />
    <col className={colStyles} width={cellWidthMd} />
    <col className={colStyles} width={cellWidthMd} />
    <col className={colStyles} width={cellWidthMd} />
    <col className={colStyles} width={cellWidthMd} />
  </colgroup>
);
export const RankingsColumnGroup = memo(RankingsColumnGroup_);
