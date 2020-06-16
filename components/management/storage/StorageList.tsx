import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import StorageRepository from "../../../src/management/storage/StorageRepository";

const StorageList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Array<{
    url: string;
    name: string;
  }> | null>(null);

  const loadDataAsync = async () => {
    const items = await StorageRepository.getTablesAsync();
    setItems(
      items.map<{ url: string; name: string }>((item) => {
        return {
          url: item,
          name: item.substring(item.lastIndexOf("/")),
        };
      })
    );
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
          <TableCell>Url</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {isLoading || items == null ? (
          <TableRow>
            <TableCell>
              <Skeleton variant="text" width={60} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width={180} />
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.url}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default StorageList;
