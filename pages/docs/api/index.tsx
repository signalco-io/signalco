import { TreeItem, TreeView } from "@mui/lab";
import { Link as MuiLink, Alert, AlertTitle, Box, Chip, FormControl, Grid, InputLabel, MenuItem, Select, Skeleton, Stack, TextField, Typography, Paper, Divider, Badge } from "@mui/material";
import { red } from "@mui/material/colors";
import axios from "axios";
import { useCallback } from "react";
import { PageFullLayout } from "../../../components/AppLayout";
import { OpenAPIV3 } from "openapi-types";
import { useLoadAndError } from "../../../src/hooks/useLoadingAndError";
import Link from "next/link";
import useHashParam from "../../../src/hooks/useHashParam";
import CopyToClipboardInput from "../../../components/shared/form/CopyToClipboardInput";
import { useContext } from "react";
import React from "react";
import OpenInNewSharpIcon from '@mui/icons-material/OpenInNewSharp';
import { camelToSentenceCase } from "../../../src/helpers/StringHelpers";
import SecurityIcon from '@mui/icons-material/Security';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { setTag } from "@sentry/nextjs";

type ChipColors = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const OperationChip = (props: { operation?: string | undefined, small?: boolean }) => {
    const color = ({
        "get": "success",
        "post": "info",
        "put": "warning",
        "delete": "error"
    }[props.operation?.toLowerCase() ?? ''] ?? "default") as ChipColors;

    return <Chip color={color} size={props.small ? "small" : "medium"} sx={{ fontWeight: 'bold' }} label={props.operation?.toUpperCase()} />;
};

type ApiOperationProps = { path: string, operation: OpenAPIV3.HttpMethods, info: OpenAPIV3.OperationObject };

const ApiOperation = (props: ApiOperationProps) => {
    const api = useContext(ApiContext);
    if (!api) throw "Api undefined";
    const { path, operation, info } = props;
    const { description, summary, externalDocs, deprecated, tags, security, responses } = info;

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
            <Stack spacing={1}>
                <Typography variant="overline">Responses</Typography>
                <Paper variant="outlined">
                    {Object.keys(responses).map((responseCode, i) => {
                        const responseCodeNumber = parseInt(responseCode, 10) || 0;
                        const responseObj = resolveRef<OpenAPIV3.ResponseObject>(api, responses[responseCode]);
                        if (!responseObj) return undefined;
                        return (
                            <>
                                <Stack key={responseCode} sx={{ p: 2 }}>
                                    <Badge variant="dot" color={responseCodeNumber < 300 ? 'success' : (responseCodeNumber < 500 ? 'warning' : 'error')}>
                                        <Typography>{responseCode}</Typography>
                                    </Badge>
                                    <Typography variant="body2">{responseObj.description}</Typography>
                                </Stack>
                                {i != Object.keys(responses).length && <Divider />}
                            </>
                        );
                    })}
                </Paper>
            </Stack>
        </Stack>
    );
};

function extractTags(api: OpenAPIV3.Document): string[] {
    const allTags = getOperations(api).flatMap(op => op?.operation?.tags).filter(i => typeof i === 'string') as string[];
    return allTags.filter((v, i, s) => s.indexOf(v) === i);
}

const Nav = () => {
    const api = useContext(ApiContext);
    const [tagName, setTagName] = useHashParam('tag');

    if (!api) throw 'API undefined';
    const { info } = api;

    const tags = api.tags?.map(t => t.name) ?? extractTags(api);
    const operations = getOperations(api);

    const handleItemSelected = (event: React.SyntheticEvent, newValue: string) => {
        if (tagName !== newValue) event.preventDefault();
        setTagName(newValue);
    }

    return (
        <Stack spacing={2}>
            <Typography component="div">{info.title} <Chip label={info.version} size="small" /> {info.license && <Chip label={info.license.name} size="small" />}</Typography>
            <TreeView
                onNodeSelect={handleItemSelected}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ overflowY: 'auto' }}>
                {tags.map(t => (
                    <TreeItem key={t} nodeId={`tag-${t}`} label={t}>
                        {operations.filter(op => (op.operation.tags?.indexOf(t) ?? -1) >= 0).map(op => (
                            <TreeItem key={`nav-route-${op.pathName}-${op.operationName}`} nodeId={`${op.pathName}-${op.operationName}`} label={(
                                <Stack sx={{ py: 0.5 }} direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                    <Typography noWrap variant="body2">{op.pathName}</Typography>
                                    <OperationChip operation={op.operationName} small />
                                </Stack>
                            )} />
                        ))}
                    </TreeItem>
                ))}
            </TreeView>
        </Stack>
    );
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

type GetOperationResult = { pathName: string, operationName: string, httpOperation: OpenAPIV3.HttpMethods, operation: OpenAPIV3.OperationObject }

function getOperations(api: OpenAPIV3.Document): Array<GetOperationResult> {
    return Object.keys(api.paths).flatMap(pathName => {
        const path = api.paths[pathName];
        if (!path) return Array<OpenAPIV3.OperationObject>();
        return enumKeys(OpenAPIV3.HttpMethods).map(opName => {
            const httpOperation = OpenAPIV3.HttpMethods[opName] as OpenAPIV3.HttpMethods;
            const pathOperation = path[httpOperation] as OpenAPIV3.OperationObject;
            if (!pathOperation) return undefined;

            return { pathName: pathName, operationName: opName, httpOperation: httpOperation, operation: pathOperation };
        });
    }).filter(i => typeof i !== 'undefined') as GetOperationResult[];
}

const Route = () => {
    const api = useContext(ApiContext);
    const [tagName] = useHashParam('tag');
    // const [pathName] = useHashParam('path');
    // const [operation] = useHashParam('op');

    if (api == null)
        return <Typography>Select action from navigation bar</Typography>

    const pathOperations = getOperations(api)
        .filter(i => typeof tagName === 'undefined' || (i.operation.tags?.map(i => i.toLowerCase()).indexOf(tagName.toLowerCase()) ?? -1) >= 0);

    return (
        <>
            {pathOperations.map(({ pathName, operationName, httpOperation, operation }) => (
                <Grid container key={`path-${pathName}-${operationName}`}>
                    <Grid item xs={6} sx={{ p: 4 }}>
                        <ApiOperation path={pathName} operation={httpOperation} info={operation} />
                    </Grid>
                    <Grid item xs={6} sx={{ borderLeft: "1px solid", borderColor: 'divider', p: 2 }}>
                        <Actions path={pathName} operation={httpOperation} info={operation} />
                    </Grid>
                </Grid>
            ))}
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
