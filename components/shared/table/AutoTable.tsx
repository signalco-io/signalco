import {
  Alert,
  LinearProgress, Link, Table,



  TableBody, TableCell, TableHead,
  TableRow,




  Typography
} from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
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
}

export interface IAutoTableProps<T extends IAutoTableItem> extends IErrorProps {
  items: Array<T> | null;
  isLoading: boolean;
}

export interface IAutoTableCellRendererProps {
  value: any;
}

const ErrorRow = (props: IErrorProps) => {
  return (
    <TableRow>
      <TableCell>
        <Alert severity="error">
          {(props.error || "Unknown error").toString()}
        </Alert>
      </TableCell>
    </TableRow>
  );
};

function CellRenderer(props: IAutoTableCellRendererProps) {
  if (typeof props.value === "string" && isAbsoluteUrl(props.value as string))
    return (
      <TableCell title={props.value}>
        <Link href={props.value} rel="noopener" target="_blank">
          <OpenInNewIcon fontSize="small" />
        </Link>
      </TableCell>
    );

  return (
    <TableCell>
      <Typography variant="body2">{props.value}</Typography>
    </TableCell>
  );
}

function AutoTable<T extends IAutoTableItem>(props: IAutoTableProps<T>) {
  const headers =
    props.items &&
    props.items.length > 0 &&
    Object.keys(props.items[0])
      .filter((ik) => ik !== "id")
      .map((ik) => {
        return { id: ik, value: camelToSentenceCase(ik) };
      });

  return (
    <Table>
      {!props.isLoading &&
        !!!props.error &&
        headers &&
        headers != null &&
        headers.length > 0 && (
          <TableHead>
            <TableRow>
              {headers ? (
                headers.map((h) => <TableCell key={h.id}>{h.value}</TableCell>)
              ) : (
                <TableCell></TableCell>
              )}
            </TableRow>
          </TableHead>
        )}
      <TableBody>
        {props.isLoading ? (
          <TableRow>
            <TableCell>
              <LinearProgress />
            </TableCell>
          </TableRow>
        ) : (
          <>
            {props.error && <ErrorRow error={props.error} />}
            {props.items &&
              props.items.length > 0 &&
              props.items.map((item) => (
                <TableRow key={item.id}>
                  {Object.keys(item)
                    .filter((ik) => ik !== "id")
                    .map((itemKey) => (
                      <CellRenderer value={item[itemKey]} key={itemKey} />
                    ))}
                </TableRow>
              ))}
            {(!!!props.items || props.items.length <= 0) && (
              <TableRow>
                <TableCell>
                  <ResultsPlaceholder />
                </TableCell>
              </TableRow>
            )}
          </>
        )}
      </TableBody>
    </Table>
  );
}

export default AutoTable;
