import { TreeItem, TreeView } from "@mui/lab";
import { Link as MuiLink, Alert, AlertTitle, Box, Button, Chip, Divider, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, Skeleton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { PageFullLayout } from "../../../components/AppLayout";
import { OpenAPI, OpenAPIV3 } from "openapi-types";
import useLoadingAndError, { useLoadAndError } from "../../../src/hooks/useLoadingAndError";
import Link from "next/link";
import useHashParam from "../../../src/hooks/useHashParam";
import CopyToClipboardInput from "../../../components/shared/form/CopyToClipboardInput";
import { useContext } from "react";
import React from "react";
import OpenInNewSharpIcon from '@mui/icons-material/OpenInNewSharp';
import { camelToSentenceCase } from "../../../src/helpers/StringHelpers";
import SecurityIcon from '@mui/icons-material/Security';

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

    return <Chip color={color} sx={{ fontWeight: 'bold' }} label={props.operation?.toUpperCase()} />;
};

type ApiOperationProps = { path: string, operation: OpenAPIV3.HttpMethods, info: OpenAPIV3.OperationObject };

const ApiOperation = (props: ApiOperationProps) => {
    const { path, operation, info } = props;
    const { description, summary, externalDocs, deprecated, tags, security } = info;

    return (
        <Stack spacing={4}>
            <Stack spacing={1}>
                <Stack spacing={1} direction="row" alignItems="center">
                    <OperationChip operation={operation} />
                    <Typography
                        variant="h2"
                        sx={{ textDecoration: deprecated ? "line-through" : undefined }}
                        title={deprecated ? "Deprecated" : undefined}>{path}</Typography>
                </Stack>
                <Stack spacing={1} direction="row" alignItems="center">
                    {security && security.map((securityVariant, i) => <SecurityBadge key={i} security={securityVariant} />)}
                    {tags && tags.map(tag => <Chip key={tag} label={tag} />)}
                </Stack>
            </Stack>
            {summary && <Typography variant="body1">{summary}</Typography>}
            <Typography variant="body2">{description}</Typography>
            {externalDocs && (
                <Stack>
                    {externalDocs.description && <Typography>{externalDocs.description}</Typography>}
                    <Link href={externalDocs.url} passHref>
                        <MuiLink>
                            <Stack spacing={1} alignItems="center" direction="row">
                                <OpenInNewSharpIcon fontSize="small" />
                                <span>More info</span>
                            </Stack>
                        </MuiLink>
                    </Link>
                </Stack>
            )}
            {/* <ApiParams header="Headers" params={[{name: 'email', dataType: 'string', description: undefined}, {name: 'email', dataType: 'string', description: undefined}]} /> */}
            {/* <ApiParams header="Query" /> */}
            {/* <ApiParams header="Body" /> */}
            {/* <ApiParams header="Responses" /> */}
            {/* {route?.query && <ApiParamsList header="Query" params={route?.query} />} */}
            {/* {route?.requestBody && <ApiParamsList header="Body" params={route?.requestBody} />} */}
        </Stack>
    );
};

const Nav = () => {
    const api = useContext(ApiContext);

    if (!api) throw 'API undefined';
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

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

function resolveRef<T>(api: OpenAPIV3.Document, obj: T | OpenAPIV3.ReferenceObject | undefined) {
    if (typeof obj === 'undefined') return undefined;
    const refObj = obj as OpenAPIV3.ReferenceObject;
    if (typeof refObj.$ref === 'undefined') return obj as T;
    const refSplit = refObj.$ref.split('/')
    if (refSplit.length <= 1 || refSplit[0] !== '#')
        return obj as T; // Don't support relative for now
    let curr: any = api;
    for (let i = 1; i < refSplit.length && typeof curr !== 'undefined'; i++)
        curr = curr[refSplit[i]];
    return curr as unknown as T;
}

const Route = () => {
    const api = useContext(ApiContext);
    const [pathName] = useHashParam('path');
    const [operation] = useHashParam('op');
    const httpOperation = operation as (OpenAPIV3.HttpMethods | undefined);

    if (api?.paths == null)
        return <Typography>Select action from navigation bar</Typography>

    return (
        <>
            {Object.keys(api.paths).flatMap(pathName => {
                const path = api.paths[pathName];
                if (!path) return [];
                return enumKeys(OpenAPIV3.HttpMethods).map(opName => {
                    const httpOperation = OpenAPIV3.HttpMethods[opName] as OpenAPIV3.HttpMethods;
                    const pathOperation = path[httpOperation];
                    if (!pathOperation) return null;

                    return (
                        <Grid container key={`path-${pathName}-${opName}`}>
                            <Grid item xs={6} sx={{ p: 4 }}>
                                <ApiOperation path={pathName} operation={httpOperation} info={pathOperation} />
                            </Grid>
                            <Grid item xs={6} sx={{ borderLeft: "1px solid", borderColor: 'divider', p: 2 }}>
                                <Actions path={pathName} operation={httpOperation} info={pathOperation} />
                            </Grid>
                        </Grid>
                    );
                })
            })}
        </>
    );
};

type ActionsProps = ApiOperationProps;

const useSecurityInfo = (requirements: OpenAPIV3.SecurityRequirementObject) => {
    const api = useContext(ApiContext);
    if (!api) throw 'API undefined';
    const types = Object.keys(requirements);
    return types
        .map(type => api.components && api.components.securitySchemes && api.components.securitySchemes[type])
        .map(t => resolveRef<OpenAPIV3.SecuritySchemeObject>(api, t));
};

const SecurityInput = (props: { security: OpenAPIV3.SecurityRequirementObject }) => {
    const { security } = props;
    const info = useSecurityInfo(security);
    return (
        <>
            {info.map(source => {
                if (source && source.type === "http") {
                    const httpSource = source as OpenAPIV3.HttpSecurityScheme;
                    return (
                        <Stack key={httpSource.scheme}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                {httpSource.description && <Typography variant="caption">{httpSource.description}</Typography>}
                                {httpSource.bearerFormat && <Typography variant="caption">{httpSource.bearerFormat}</Typography>}
                            </Stack>
                            <TextField variant="filled" label={camelToSentenceCase(httpSource.scheme)}></TextField>
                        </Stack>
                    );
                } else if (source) {
                    return <Typography key={source.type} color={red[400]} fontWeight="bold" variant="overline">{"Not supported security type \"" + source.type + "\""}</Typography>
                } else {
                    return <Typography key="unknown" color={red[400]} fontWeight="bold" variant="overline">Security not defined</Typography>
                }
            })}
        </>
    );
};

const SecurityBadge = (props: { security: OpenAPIV3.SecurityRequirementObject }) => {
    const { security } = props;
    const info = useSecurityInfo(security);
    return (
        <>
            {info.map(source => {
                if (source && source.type === "http") {
                    const httpSource = source as OpenAPIV3.HttpSecurityScheme;
                    return <Chip variant="outlined" icon={<SecurityIcon fontSize="small" />} key={httpSource.scheme} label={camelToSentenceCase(httpSource.scheme)} />;
                } else if (source) {
                    return <Typography key={source.type} color={red[400]} fontWeight="bold" variant="overline">{"Not supported security type \"" + source.type + "\""}</Typography>
                } else {
                    return <Typography key="unknown" color={red[400]} fontWeight="bold" variant="overline">Security not defined</Typography>
                }
            })}
        </>
    );
}

const Actions = (props: ActionsProps) => {
    const { info } = props;
    const api = useContext(ApiContext);
    const [selectedServer, setSelectedServer] = useHashParam('server');

    if (!api) throw 'API undefined';
    const { servers } = api;
    const selectedServerUrl = selectedServer ?? (servers && servers.length > 0 ? servers[0].url : 'https://example.com');

    const { security } = info;

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
            {security && (
                <Stack spacing={1}>
                    <Typography variant="overline">Authentication</Typography>
                    <Stack>
                        {security.map((securityVariant, i) => <SecurityInput key={i} security={securityVariant} />)}
                    </Stack>
                </Stack>
            )}
        </Stack>
    );
}

async function getOpenApiDoc(url: string) {
    return (await axios.get<OpenAPIV3.Document>(url)).data;
}

const ApiContext = React.createContext<OpenAPIV3.Document | undefined>(undefined);

const DocsApiPage = () => {
    const url = "https://api.signalco.io/api/swagger.json";
    //const url = "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v3.0/uspto.json";
    const apiRequest = useCallback(() => getOpenApiDoc(url), [url]);
    const { item: api, isLoading, error } = useLoadAndError<OpenAPIV3.Document>(apiRequest);

    console.info("OpenAPI scheme: ", api);

    return (
        <ApiContext.Provider value={api}>
            <Stack>
                {error && (
                    <Alert severity="error" variant="filled" sx={{ borderRadius: 0 }}>
                        <AlertTitle>{"Couldn't load OpenAPI docs"}</AlertTitle>
                        {error}
                    </Alert>
                )}
                <Grid container>
                    <Grid item xs={3} sx={{ borderRight: "1px solid", borderColor: 'divider', px: 2, py: 4 }}>
                        {isLoading || !api ? <NavSkeleton /> : <Nav />}
                    </Grid>
                    <Grid item xs={9}>
                        <Route />
                    </Grid>
                </Grid>
            </Stack>
        </ApiContext.Provider>
    );
};

DocsApiPage.layout = PageFullLayout;

export default DocsApiPage;