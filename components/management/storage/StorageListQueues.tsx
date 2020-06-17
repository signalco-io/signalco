import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Link,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import StorageRepository from "../../../src/management/storage/StorageRepository";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Alert from "@material-ui/lab/Alert";

const StorageListQueues = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Array<{
    url: string;
    name: string;
  }> | null>(null);

  const loadDataAsync = async () => {
    try {
      const items = await StorageRepository.getQueuesAsync();
      setItems(
        items.map<{ url: string; name: string }>((item) => {
          return {
            url: item,
            name: item.substring(item.lastIndexOf("/")),
          };
        })
      );
    } catch (err) {
      setItems([]);
      setError(err);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadDataAsync();
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {isLoading ? (
          Array.from(Array(4).keys()).map((i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton variant="text" width={60} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={180} />
              </TableCell>
            </TableRow>
          ))
        ) : error ? (
          <TableRow>
            <TableCell colSpan={2}>
              <Alert severity="error">
                {(error || "Unknown error").toString()}
              </Alert>
            </TableCell>
          </TableRow>
        ) : (
          (items || []).map((item) => (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell title={item.url} align="right">
                <Link href={item.url} rel="noopener" target="_blank">
                  <OpenInNewIcon fontSize="small" />
                </Link>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default StorageListQueues;
