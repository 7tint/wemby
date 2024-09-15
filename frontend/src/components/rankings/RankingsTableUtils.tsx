import { memo, ReactNode } from "react";
import { SortDirection } from "@tanstack/react-table";
import { TableCell } from "@/components/ui/table";
import Tooltip from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const cellWidthSm = "50px";
export const cellWidthMd = "65px";
export const cellWidthLg = "125px";

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
}: {
  id?: string;
  label: string;
  text: string | ReactNode;
  sort?: false | SortDirection;
}) => {
  const calcHeaderSortColor = (sort: false | SortDirection) => {
    if (sort === "asc") return "bg-orange-200";
    if (sort === "desc") return "bg-teal-200";
    return "bg-slate-300";
  };

  return (
    <div key={id} className="flex flex-col h-full justify-start items-center">
      <div className={cn("h-3 w-full", calcHeaderSortColor(sort))} />
      <Tooltip label={label}>
        <div className="my-2 font-semibold">{text}</div>
      </Tooltip>
    </div>
  );
};
export const RankingsHeaderCell = memo(RankingsHeaderCell_);

/*
 * RANKINGS COLUMNS
 */
const RankingsColumnGroup_ = ({ u, ss }: { u: boolean; ss: boolean }) => (
  <colgroup>
    <col className={colStyles} width={cellWidthSm} />
    <col className={colStyles} width={cellWidthSm} />
    {!u && <col className={colStyles} width={cellWidthMd} />}
    <col className={colStyles} width={cellWidthMd} />
    <col className={cn(colStyles, "w-fit")} />
    <col className={colStyles} width={cellWidthSm} />
    <col className={colStyles} width={cellWidthSm} />
    <col className={colStyles} width={cellWidthSm} />
    <col className={colStyles} width={ss ? cellWidthMd : cellWidthLg} />
    <col className={colStyles} width={ss ? cellWidthMd : cellWidthLg} />
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
