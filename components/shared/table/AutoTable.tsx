import React from 'react';
import NextLink from 'next/link';
import {
  Alert,
  Box,
  LinearProgress, Link,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IErrorProps from '../interfaces/IErrorProps';
import ResultsPlaceholder from '../indicators/ResultsPlaceholder';
import { ChildrenProps } from '../../../src/sharedTypes';
import useSearch, { filterFuncObjectStringProps } from '../../../src/hooks/useSearch';
import { LocalizeFunc } from '../../../src/hooks/useLocale';
import {
  camelToSentenceCase,
  isAbsoluteUrl
} from '../../../src/helpers/StringHelpers';

export interface IAutoTableItem {
  id: string;
  [key: string]: any;
  _opacity?: number,
  _link?: string
}

export interface IAutoTableProps<T extends IAutoTableItem> extends IErrorProps {
  items: Array<T> | undefined;
  isLoading: boolean;
  onRowClick?: (item: T) => void;
  hideSearch?: boolean;
  localize?: LocalizeFunc;
}

export interface IAutoTableCellRendererProps {
  value: any;
  style?: React.CSSProperties,
  row: number,
  column: number,
  link: string,
  hasClick: boolean,
  onClick: () => void
}

function ErrorRow(props: IErrorProps) {
  return (
    <div>
      <div>
        <Alert severity="error">
          {(props.error || 'Unknown error').toString()}
        </Alert>
      </div>
    </div>
  );
}

function DefaultCallWrapper({ children }: ChildrenProps) {
  return <>{children}</>;
}

function CellRenderer(props: IAutoTableCellRendererProps) {
  if (typeof props.value === 'string' && isAbsoluteUrl(props.value as string))
    return (
      <Tooltip title={props.link || props.value}>
        <Box onClick={props.hasClick ? props.onClick : undefined} sx={{ cursor: props.hasClick ? 'pointer' : 'default' }}>
          <Link href={props.link || props.value} rel="noopener" target="_blank">
            <OpenInNewIcon style={props.style} fontSize="small" />
          </Link>
        </Box>
      </Tooltip>
    );

  let Wrapper = DefaultCallWrapper;
  if (props.link) {
    Wrapper = function LinkWrapper({ children }: ChildrenProps) {
      return <Box>
        <NextLink passHref href={props.link}>{children}</NextLink>
      </Box>;
    };
  }

  // TODO: Implement object display
  let value = props.value;
  if (typeof value === 'object' &&
    typeof value?.type === 'undefined' &&
    typeof value?.key === 'undefined' &&
    typeof value?.props === 'undefined') {
    value = JSON.stringify(value);
  }

  return (
    <Wrapper>
      <Box
        onClick={props.hasClick ? props.onClick : undefined}
        sx={{
          cursor: props.hasClick || props.link ? 'pointer' : 'default',
          gridRow: props.row,
          gridColumn: props.column,
          px: 2,
          py: 1,
          borderBottom: '1px solid rgba(128,128,128,0.6)',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
        <Typography variant="body2" style={props.style} component="div">{value}</Typography>
      </Box>
    </Wrapper>
  );
}

const filterItemKey = (ik: string) => ik !== 'id' && !ik.startsWith('_');

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
    prev[curr] = props.localize ? props.localize(curr) : camelToSentenceCase(curr);
    return prev;
  }, headerRow);

  const cells = header && props.items ? [header, ...filteredItems] : [];

  return (
    <Stack spacing={1} sx={{ height: '100%' }}>
      {!props.hideSearch && showSearch && <TextField label={props.localize ? props.localize('SearchLabel') : 'Search...'} sx={{ mx: 2 }} size="small" value={searchText} onChange={(e) => handleSearchTextChange(e.target.value)} />}
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflow: 'auto', display: 'grid' }}>
          {props.isLoading && <LinearProgress />}
          {Boolean(props.error) && <ErrorRow error={props.error} />}
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
                    link={item._link}
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

export default AutoTable;
