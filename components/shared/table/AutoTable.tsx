import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  LinearProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { camelToSentenceCase, isUrl } from "../../../src/helpers/StringHelpers";

interface IAutoTableProps extends IAutoTableErrorProps {
  items: Array<object> | null;
  isLoading: boolean;
}

interface IAutoTableErrorProps {
  error: string | null;
}

interface IAutoTableCellRendererProps {
  value: any | null;
}

const ErrorRow = (props: IAutoTableErrorProps) => {
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

const CellRenderer = (props: IAutoTableCellRendererProps) => {
  if (isUrl(props.value))
    return (
      <TableCell title={props.value}>
        <Link href={props.value} rel="noopener" target="_blank">
          <OpenInNewIcon fontSize="small" />
        </Link>
      </TableCell>
    );

  return <TableCell>{props.value}</TableCell>;
};

const AutoTable = (props: IAutoTableProps) => {
  const headers =
    props.items &&
    props.items.length > 0 &&
    typeof props.items[0] === "object" &&
    Object.keys(props.items[0]).map((ik) => camelToSentenceCase(ik));

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
                headers.map((h) => <TableCell>{h}</TableCell>)
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
                <TableRow>
                  {typeof item === "object" ? (
                    Object.values(item).map((itemValue) => (
                      <CellRenderer value={itemValue} />
                    ))
                  ) : (
                    <CellRenderer value={item} />
                  )}
                </TableRow>
              ))}
            {props.items && props.items.length <= 0 && (
              <TableRow>
                <TableCell>No results</TableCell>
              </TableRow>
            )}
          </>
        )}
      </TableBody>
    </Table>
  );
};

export default AutoTable;
