import {
  Alert,
  Box,
  LinearProgress, Link,
  OutlinedInput,
  Stack,
  Typography
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import {
  camelToSentenceCase,
  isAbsoluteUrl
} from "../../../src/helpers/StringHelpers";
import ResultsPlaceholder from "../indicators/ResultsPlaceholder";
import IErrorProps from "../interfaces/IErrorProps";
import { useEffect } from "react-transition-group/node_modules/@types/react";
import useSearch, { filterFuncObjectStringProps } from "../../../src/hooks/useSearch";

export interface IAutoTableItem {
  id: string;
  [key: string]: any;
  _opacity?: number
}

export interface IAutoTableProps<T extends IAutoTableItem> extends IErrorProps {
  items: Array<T> | undefined;
  isLoading: boolean;
  onRowClick?: (item: IAutoTableItem) => void;
}

export interface IAutoTableCellRendererProps {
  value: any;
  style?: React.CSSProperties,
  row: number,
  column: number,
  hasClick: boolean,
  onClick: () => void
}

const ErrorRow = (props: IErrorProps) => {
  return (
    <div>
      <div>
        <Alert severity="error">
          {(props.error || "Unknown error").toString()}
        </Alert>
      </div>
    </div>
  );
};

const CellRenderer = observer((props: IAutoTableCellRendererProps) => {
  if (typeof props.value === "string" && isAbsoluteUrl(props.value as string))
    return (
      <Box title={props.value} onClick={props.hasClick ? props.onClick : undefined} sx={{ cursor: props.hasClick ? 'pointer' : 'default' }}>
        <Link href={props.value} rel="noopener" target="_blank">
          <OpenInNewIcon style={props.style} fontSize="small" />
        </Link>
      </Box>
    );

  return (
    <Box
      display="inline-block"
      onClick={props.hasClick ? props.onClick : undefined}
      sx={{ cursor: props.hasClick ? 'pointer' : 'default', gridRow: props.row, gridColumn: props.column, px: 2, py: 1.5, borderBottom: '1px solid rgba(128,128,128,0.6)', display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2" style={props.style} component="div">{props.value}</Typography>
    </Box>
  );
});

const filterItemKey = (ik: string) => ik !== "id" && !ik.startsWith("_");

function AutoTable<T extends IAutoTableItem>(props: IAutoTableProps<T>) {
  const [filteredItems, showSearch, searchText, handleSearchTextChange] = useSearch(props.items, filterFuncObjectStringProps);

  const headersKeys =
    props.items &&
      props.items.length > 0 ?
      Object.keys(props.items[0])
        .filter(filterItemKey)
      : undefined;

  const headerRow: { id: string, [key: string]: string } = { id: 'headers' };
  const header = headersKeys?.reduce((prev, curr) => {
    prev[curr] = camelToSentenceCase(curr);
    return prev;
  }, headerRow);

  const cells = header && props.items ? [header, ...filteredItems] : [];

  return (
    <Stack spacing={1} sx={{ height: '100%' }}>
      {showSearch && <OutlinedInput placeholder="Search..." sx={{ mx: 2 }} size="small" value={searchText} onChange={(e) => handleSearchTextChange(e.target.value)} />}
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflow: 'auto', display: 'grid' }}>
          {props.isLoading && <LinearProgress />}
          {props.error && <ErrorRow error={props.error} />}
          {cells?.length > 0 && cells.map((item, rowIndex) => {
            return Object.keys(item)
              .filter(filterItemKey)
              .map((itemKey, index) => {
                return (
                  <CellRenderer
                    key={itemKey}
                    value={item[itemKey]}
                    row={rowIndex + 1}
                    column={index + 1}
                    style={{ opacity: item._opacity ? item._opacity : 1 }}
                    hasClick={typeof props.onRowClick !== 'undefined'}
                    onClick={() => props.onRowClick && props.onRowClick(item)} />
                );
              })
          })}
          {(!props.isLoading && !(props.items?.length)) && (
            <Box p={2}>
              <ResultsPlaceholder />
            </Box>
          )}
        </div>
      </div>
    </Stack>
  );
}

export default observer(AutoTable);
