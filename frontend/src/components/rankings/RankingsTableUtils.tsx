import { Box, Flex, Td, Tooltip } from "@chakra-ui/react";
import { SortDirection } from "@tanstack/react-table";
import { memo, ReactNode } from "react";

export const cellWidthSm = "50px";
export const cellWidthMd = "65px";
export const cellWidthLg = "125px";

export const colProps = {
  borderX: "1px",
  borderColor: "gray.100",
};

export const headerColProps = {
  ...colProps,
  borderColor: "gray.300",
};

/*
 * TABLE CELL COMPONENTS
 */
const TableTd_ = ({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any; // eslint-disable-line
}) => (
  <Td px={2} py={1} {...props}>
    <Flex justify="center" align="center">
      {children}
    </Flex>
  </Td>
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
  text: string;
  sort?: false | SortDirection;
}) => {
  const calcHeaderSortColor = (sort: false | SortDirection) => {
    if (sort === "asc") return "orange.200";
    if (sort === "desc") return "teal.200";
    return "gray.300";
  };

  return (
    <Flex key={id} direction="column" justify="center" align="center">
      <Box
        height={3}
        width="100%"
        backgroundColor={calcHeaderSortColor(sort)}
      />
      <Tooltip label={label} hasArrow placement="top">
        <Box my={2} fontWeight={700}>
          {text}
        </Box>
      </Tooltip>
    </Flex>
  );
};
export const RankingsHeaderCell = memo(RankingsHeaderCell_);

/*
 * RANKINGS COLUMNS
 */
const RankingsColumnGroup_ = ({ u, ss }: { u: boolean; ss: boolean }) => (
  <Box as="colgroup">
    <Box as="col" {...colProps} width={cellWidthSm} />
    <Box as="col" {...colProps} width={cellWidthSm} />
    {!u && <Box as="col" {...colProps} width={cellWidthMd} />}
    <Box as="col" {...colProps} width={cellWidthMd} />
    <Box as="col" {...colProps} width="260px" />
    <Box as="col" {...colProps} width={cellWidthSm} />
    <Box as="col" {...colProps} width={cellWidthSm} />
    <Box as="col" {...colProps} width={cellWidthSm} />
    <Box as="col" {...colProps} width={ss ? cellWidthMd : cellWidthLg} />
    <Box as="col" {...colProps} width={ss ? cellWidthMd : cellWidthLg} />
    <Box as="col" {...colProps} width={cellWidthMd} />
    <Box as="col" {...colProps} width={cellWidthMd} />
    <Box as="col" {...colProps} width={cellWidthMd} />
    <Box as="col" {...colProps} width={cellWidthMd} />
    <Box as="col" {...colProps} width={cellWidthMd} />
    <Box as="col" {...colProps} width={cellWidthMd} />
    <Box as="col" {...colProps} width={cellWidthMd} />
    <Box as="col" {...colProps} width={cellWidthMd} />
  </Box>
);
export const RankingsColumnGroup = memo(RankingsColumnGroup_);
