import { TreeItem, TreeView } from "@mui/lab";
import { Alert, AlertTitle, Box, Chip, Divider, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, Skeleton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { PageFullLayout } from "../../../components/AppLayout";
import { OpenAPIV3 } from "openapi-types";
import useLoadingAndError, { useLoadAndError } from "../../../src/hooks/useLoadingAndError";
import Link from "next/link";
import useHashParam from "../../../src/hooks/useHashParam";
import CopyToClipboardInput from "../../../components/shared/form/CopyToClipboardInput";

const DataInput = (props: DataInputProps) => {
    const { dataType, value, onChange } = props;

    switch (dataType) {
        case 'string':
            return <OutlinedInput sx={{ minWidth: 210 }} size="small" value={value} onChange={(e) => onChange(e.target.value)} />
        case 'number':
        case 'double':
        case 'integer':
            return <OutlinedInput sx={{ minWidth: 210 }} size="small" type={'number'} value={value} onChange={(e) => onChange(e.target.value)} />
        default:
            return <Typography color={red[400]} fontWeight="bold" variant="overline">{"Not supported data type \"" + dataType + "\""}</Typography>
    }
};

const ApiParam = (props: ApiParamInfo) => (
    <Stack sx={{ px: 2, py: 2 }} direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack>
            <Stack direction="row" alignItems="end" spacing={1}>
                <Typography fontWeight="bold">{props.name}</Typography>
                <Typography variant="caption" color="textSecondary">{props.dataType}</Typography>
            </Stack>
            {(props.description?.length ?? 0) > 0 && <Typography color="textSecondary">{props.description}</Typography>}
        </Stack>
        <DataInput dataType={props.dataType} value={undefined} onChange={() => { }} />
    </Stack>
);

const ApiParamsList = (props: { header: string, params: ApiParamInfo[] }) => (
    <Stack spacing={1}>
        <Typography variant="overline">{props.header}</Typography>
        <Paper variant="outlined">
            <Stack>
                {props.params.map((param, i) => (
                    <>
                        <ApiParam key={param.name} {...param} />
                        {i !== props.params.length - 1 && <Divider key={`divider-${param.name}`} />}
                    </>
                ))}
            </Stack>
        </Paper>
    </Stack>
);

type ChipColors = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const OperationChip = (props: { operation?: string | undefined }) => {
    const color = ({
        "get": "success",
        "post": "info",
        "put": "warning",
        "delete": "error"
    }[props.operation ?? ''] ?? "default") as ChipColors;

    return <Chip color={color} label={props.operation} size="small" />;
};

const ApiOperation = (props: { path: string, operation: OpenAPIV3.HttpMethods, info: OpenAPIV3.OperationObject }) => {
    const { path, operation, info } = props;

    return (
        <Stack spacing={4}>
            <Stack spacing={1}>
                <Typography variant="h2">{path}</Typography>
                <Box>
                    <Stack spacing={1} direction="row" alignItems="center">
                        <OperationChip operation={operation} />
                        {/* <Typography variant="body2" color="textSecondary">{route?.fullPath}</Typography> */}
                    </Stack>
                </Box>
            </Stack>
            <Typography variant="body1">{info.description}</Typography>
            {info.summary && <Typography variant="body2">{info.summary}</Typography>}
            {/* <ApiParams header="Headers" params={[{name: 'email', dataType: 'string', description: undefined}, {name: 'email', dataType: 'string', description: undefined}]} /> */}
            {/* <ApiParams header="Query" /> */}
            {/* <ApiParams header="Body" /> */}
            {/* <ApiParams header="Responses" /> */}
            {/* {route?.query && <ApiParamsList header="Query" params={route?.query} />} */}
            {/* {route?.requestBody && <ApiParamsList header="Body" params={route?.requestBody} />} */}
        </Stack>
    );
};

const Nav = (props: { api: OpenAPIV3.Document }) => {
    const { api } = props;
    const { info } = api;

    return (<Stack spacing={2}>
        <Stack>
            <Typography component="div">{info.title} <Chip label={info.version} size="small" /> {info.license && <Chip label={info.license.name} size="small" />}</Typography>
        </Stack>
        <Box>
            {/* {api.api?.paths && Object.keys(api.api.paths).map(path => (
            <div>{api.api.paths[path].}</div>
        ))} */}
            {/* <TreeView onNodeSelect={handleRouteSelect}>
            {api.routes?.map(route => (
                <TreeItem key={route.id} nodeId={route.id} label={(
                    <Stack sx={{ py: 0.5 }} direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Typography noWrap variant="body2">{route?.path}</Typography>
                        <OperationChip operation={route?.operation} />
                    </Stack>
                )} />
            ))}
        </TreeView> */}
        </Box>
    </Stack>);
};

const NavSkeleton = () => (
    <Stack>
        <Skeleton width="80%" />
    </Stack>
);

const Route = (props: { api: OpenAPIV3.Document | undefined }) => {
    const { api } = props;
    const [tagName] = useHashParam('tag');
    const [pathName] = useHashParam('path');
    const [operation] = useHashParam('op');
    const httpOperation = operation as (OpenAPIV3.HttpMethods | undefined);

    const path = api?.paths && api.paths[pathName || ''];
    const pathOperation = path && httpOperation && path[httpOperation];

    return (api?.paths == null || pathName == null || httpOperation == null || pathOperation == null)
        ? <Typography>Select action from navigation bar</Typography>
        : <ApiOperation path={pathName} operation={httpOperation} info={pathOperation} />;
};

const Actions = (props: { api: OpenAPIV3.Document }) => {
    const { api } = props;
    const { servers } = api;
    const [selectedServer, setSelectedServer] = useHashParam('server');

    const selectedServerUrl = selectedServer ?? (servers && servers.length > 0 ? servers[0].url : 'https://example.com');

    return (
        <Stack spacing={2}>
            {servers && servers.length > 1 &&
                <FormControl fullWidth variant="filled" size="small">
                    <InputLabel id="server-select-label">Server</InputLabel>
                    <Select
                        labelId="server-select-label"
                        renderValue={(value) => api?.servers?.find(s => s.url === value)?.description || value}
                        size="small"
                        fullWidth
                        value={selectedServer || ''}
                        onChange={(e) => setSelectedServer(e.target.value)}>
                        {servers.map(server => (
                            <MenuItem value={server.url} key={server.url}>
                                <Stack>
                                    <Typography noWrap>{server.description ?? server.url}</Typography>
                                    {server.description && <Typography noWrap variant="caption" color="textSecondary">{server.url}</Typography>}
                                </Stack>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>}
            <CopyToClipboardInput id="base-address" label="Base address" readOnly fullWidth sx={{ fontFamily: "Consolas", fontSize: '0.8em' }} value={selectedServerUrl} />
        </Stack>
    );
}

const ActionsSkeleton = () => (
    <Stack>
        <Skeleton width="100%" variant="rectangular" sx={{ height: 48 }} />
    </Stack>
);

async function getOpenApiDoc(url: string) {
    return (await axios.get<OpenAPIV3.Document>(url)).data;
}

const DocsApiPage = () => {
    const url = "https://api.signalco.io/api/swagger.json";
    const apiRequest = useCallback(() => getOpenApiDoc(url), [url]);
    let { item: api, isLoading, error } = useLoadAndError<OpenAPIV3.Document>(apiRequest);

    console.info("OpenAPI scheme: ", api);

    return (
        <Stack>
            {error && (
                <Alert severity="error" variant="filled" sx={{ borderRadius: 0 }}>
                    <AlertTitle>{"Couldn't load OpenAPI docs"}</AlertTitle>
                    {error}
                </Alert>
            )}
            <Grid container>
                <Grid item xs={3} sx={{ borderRight: "1px solid", borderColor: 'divider', px: 2, py: 4 }}>
                    {isLoading || !api ? <NavSkeleton /> : <Nav api={api} />}
                </Grid>
                <Grid item xs={5} sx={{ p: 4 }}>
                    <Route api={api} />
                </Grid>
                <Grid item xs={4} sx={{ borderLeft: "1px solid", borderColor: 'divider', p: 2 }}>
                    {isLoading || !api ? <ActionsSkeleton /> : <Actions api={api} />}
                </Grid>
            </Grid>
        </Stack>
    );
};

DocsApiPage.layout = PageFullLayout;

export default DocsApiPage;