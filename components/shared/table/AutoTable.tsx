import {
  Alert,
  Box,
  LinearProgress, Link,
  Typography
} from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { observer } from "mobx-react-lite";
import React from "react";
import {
  camelToSentenceCase,
  isAbsoluteUrl
} from "../../../src/helpers/StringHelpers";
import ResultsPlaceholder from "../indicators/ResultsPlaceholder";
import IErrorProps from "../interfaces/IErrorProps";

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
  column: number
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
  console.log("cell", props);

  if (typeof props.value === "string" && isAbsoluteUrl(props.value as string))
    return (
      <div title={props.value}>
        <Link href={props.value} rel="noopener" target="_blank">
          <OpenInNewIcon style={props.style} fontSize="small" />
        </Link>
      </div>
    );

  return (
    <Box display="inline-block" sx={{ gridRow: props.row, gridColumn: props.column, px: 2, py: 1.5, borderBottom: '1px solid rgba(128,128,128,0.6)', display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2" style={props.style}>{props.value}</Typography>
    </Box>
  );
});

const filterItemKey = (ik: string) => ik !== "id" && !ik.startsWith("_");

function AutoTable<T extends IAutoTableItem>(props: IAutoTableProps<T>) {

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

  const cells = header && props.items ? [header, ...props.items] : [];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflow: 'auto', flexGrow: 1, display: 'grid' }}>
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
                  style={{ opacity: item._opacity ? item._opacity : 1 }} />
              );
            })
        })}
        {(!props.isLoading && !(props.items?.length)) && (
          <ResultsPlaceholder />
        )}
      </div>
    </div>
  );
}

export default AutoTable;
