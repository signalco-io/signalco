import {
  Alert,
  Box,
  LinearProgress, Link, Table,
  TableBody, TableCell, TableHead, TableRow,
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
  style?: React.CSSProperties
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
      <div title={props.value}>
        <Link href={props.value} rel="noopener" target="_blank">
          <OpenInNewIcon style={props.style} fontSize="small" />
        </Link>
      </div>
    );

  return (
    <Box display="inline-block" sx={{ gridRow: props.row, gridColumn: props.column }}>
      <Typography variant="body2" style={props.style}>{props.value}</Typography>
    </Box>
  );
});

function AutoTable<T extends IAutoTableItem>(props: IAutoTableProps<T>) {
  const headers =
    props.items &&
    props.items.length > 0 &&
    Object.keys(props.items[0])
      .filter((ik) => ik !== "id" && !ik.startsWith("_"))
      .map((ik) => {
        return { id: ik, value: camelToSentenceCase(ik) };
      });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflow: 'auto', flexGrow: 1, display: 'grid' }}>
        {props.error && <ErrorRow error={props.error} />}
        {props.items?.length && props.items.map((item, rowIndex) => {
          Object.keys(item)
          .filter((ik) => ik !== "id" && !ik.startsWith("_"))
          .map((itemKey, index) => (
            <CellRenderer value={item[itemKey]} key={itemKey} row={rowIndex} column={index + 1} style={{ opacity: item._opacity ? item._opacity : 1 }} />
          ))
        })}
        {(!(props.items?.length)) && (
          <ResultsPlaceholder />
        )}
      </div>
    </div>
  );
}

export default AutoTable;
