import React, { useCallback, useState, useContext, createContext } from 'react';
import { OpenAPIV3 } from 'openapi-types';
import Link from 'next/link';
import axios, { AxiosError, Method } from 'axios';
import { red } from '@mui/material/colors';
import { Alert, AlertTitle, Badge, Box, Button, Divider, FormControl, Grid, InputLabel, MenuItem, Link as MuiLink, Paper, Select, Skeleton, Stack } from '@mui/material';
import { TreeItem, TreeView } from '@mui/lab';
import {Typography, TextField } from '@mui/joy';
import SendIcon from '@mui/icons-material/Send';
import SecurityIcon from '@mui/icons-material/Security';
import OpenInNewSharpIcon from '@mui/icons-material/OpenInNewSharp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useLoadAndError from 'src/hooks/useLoadAndError';
import Chip from 'components/shared/indicators/Chip';
import { ObjectDictAny } from '../../../src/sharedTypes';
import appSettingsProvider from '../../../src/services/AppSettingsProvider';
import useHashParam from '../../../src/hooks/useHashParam';
import { camelToSentenceCase } from '../../../src/helpers/StringHelpers';
import CopyToClipboardInput from '../../../components/shared/form/CopyToClipboardInput';
import { PageFullLayout } from '../../../components/layouts/PageFullLayout';
import CodeEditor from '../../../components/code/CodeEditor';

type ChipColors = 'neutral' | 'primary' | 'danger' | 'info' | 'success' | 'warning';

function OperationChip(props: { operation?: string | undefined, small?: boolean }) {
    const color = ({
        'get': 'success',
        'post': 'info',
        'put': 'warning',
        'delete': 'danger'
    }[props.operation?.toLowerCase() ?? ''] ?? 'neutral') as ChipColors;

    return <Chip color={color} size={props.small ? 'sm' : 'md'}>{props.operation?.toUpperCase()}</Chip>;
}

type ApiOperationProps = { path: string, operation: OpenAPIV3.HttpMethods, info: OpenAPIV3.OperationObject };

function schemaToJson(api: OpenAPIV3.Document, schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined): any | undefined {
    const schemaObj = resolveRef(api, schema);
    if (typeof schemaObj === 'undefined') return undefined;

    switch (schemaObj.type) {
        case 'string':
            return '';
        case 'boolean': return true;
        case 'number':
        case 'integer': return 0;
        case 'object':
            if (typeof schemaObj.properties === 'undefined') return {};
            let curr: ObjectDictAny = {};
            Object.keys(schemaObj.properties).forEach(prop => {
                if (schemaObj.properties) {
                    curr[prop] = schemaToJson(api, schemaObj.properties[prop]);
                }
            });
            return curr;
        case 'array':
            const arraySchema = schemaObj as OpenAPIV3.ArraySchemaObject;
            return [schemaToJson(api, arraySchema.items)];
        default: return undefined;
    }
};

function NonArraySchema(props: { name: string, schema: OpenAPIV3.NonArraySchemaObject }) {
    const propertyNames = props.schema.properties && Object.keys(props.schema.properties);
    const properties = typeof props.schema.properties !== 'undefined' && propertyNames
        ? propertyNames.map(pn => ({ name: pn, prop: props.schema.properties![pn] }))
        : [];

    return (
        <div>
            {properties && properties.map(prop =>
                <Schema key={prop.name} name={prop.name} schema={prop.prop} />)}
        </div>
    );
}
function ArraySchema(props: { name: string, schema: OpenAPIV3.ArraySchemaObject }) {
    return <Typography key={props.name} color="danger" fontWeight="bold">{'Not supported property type "array"'}</Typography>
}

function Schema(props: { name: string, schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined }) {
    const api = useContext(ApiContext);
    if (!api) throw 'API is undefined';

    const schemaResolved = resolveRef(api, props.schema);

    return (
        <div>
            <Stack spacing={1} direction="row" alignItems="center">
                <Typography>{props.name}</Typography>
                <Typography level="body2">{schemaResolved?.type}</Typography>
            </Stack>
            <Box sx={{ borderLeft: '1px solid', borderColor: 'divider', px: 2 }}>
                {schemaResolved?.type === 'array'
                    ? <ArraySchema name={props.name} schema={schemaResolved as OpenAPIV3.ArraySchemaObject} />
                    : <NonArraySchema name={props.name} schema={schemaResolved as OpenAPIV3.NonArraySchemaObject} />}
            </Box>
        </div>
    );
}

function ApiOperation(props: ApiOperationProps) {
    const api = useContext(ApiContext);
    if (!api) throw 'Api undefined';
    const { path, operation, info } = props;
    const { description, summary, externalDocs, deprecated, tags, security, parameters, requestBody, responses } = info;

    const requestBodyResolved = requestBody && resolveRef(api, requestBody);
    const parametersResolved = parameters && parameters.map(param => resolveRef(api, param)).filter(p => typeof p !== 'undefined') as OpenAPIV3.ParameterObject[];

    return (
        <Stack spacing={4}>
            <Stack spacing={1}>
                <Stack spacing={1} direction="row" alignItems="center">
                    <OperationChip operation={operation} />
                    <Typography
                        level="h6"
                        sx={{ textDecoration: deprecated ? 'line-through' : undefined }}
                        title={deprecated ? 'Deprecated' : undefined}>{path}</Typography>
                </Stack>
                <Stack spacing={1} direction="row" alignItems="center">
                    {security && security.map((securityVariant, i) => <SecurityBadge key={i} security={securityVariant} />)}
                    {tags && tags.map(tag => <Chip key={tag}>{tag}</Chip>)}
                </Stack>
            </Stack>
            {summary && <Typography>{summary}</Typography>}
            {description && <Typography level="body2">{description}</Typography>}
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
            {parametersResolved && (
                <Stack spacing={1}>
                    <Typography textTransform="uppercase">Parameters</Typography>
                    <Paper variant="outlined">
                        {parametersResolved.map((parameter, i) => (
                            <React.Fragment key={parameter.name}>
                                <Stack sx={{ p: 2 }}>
                                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                                        <Typography textTransform="uppercase" fontWeight={400}>{parameter.name}</Typography>
                                        <Stack direction="row" alignItems="center" spacing="4px">
                                            <Typography level="body2">in</Typography>
                                            <Typography level="body2" textTransform="uppercase">{parameter.in}</Typography>
                                        </Stack>
                                    </Stack>
                                    {parameter.description && <Typography level="body2">{parameter.description}</Typography>}
                                </Stack>
                                {i != Object.keys(parametersResolved).length && <Divider />}
                            </React.Fragment>
                        ))}
                    </Paper>
                </Stack>
            )}
            {requestBodyResolved && (
                <Stack spacing={1}>
                    <Typography textTransform="uppercase">Request body</Typography>
                    {requestBodyResolved.description && <Typography level="body2">{requestBodyResolved.description}</Typography>}
                    <Paper variant="outlined">
                        <Stack sx={{ p: 2 }}>
                            {Object.keys(requestBodyResolved.content).map(contentType => (
                                <React.Fragment key={contentType}>
                                    {requestBodyResolved.content[contentType].schema &&
                                        <Schema name={contentType} schema={requestBodyResolved.content[contentType].schema} />}
                                </React.Fragment>
                            ))}
                        </Stack>
                    </Paper>
                </Stack>
            )}
            <Stack spacing={1}>
                <Typography textTransform="uppercase">Responses</Typography>
                <Paper variant="outlined">
                    {Object.keys(responses).map((responseCode, i) => {
                        const responseCodeNumber = parseInt(responseCode, 10) || 0;
                        const responseObj = resolveRef<OpenAPIV3.ResponseObject>(api, responses[responseCode]);
                        if (!responseObj) return undefined;
                        return (
                            <React.Fragment key={responseCode}>
                                <Stack sx={{ p: 2 }}>
                                    <ResponseStatusCode statusCode={responseCodeNumber} />
                                    <Typography level="body2">{responseObj.description}</Typography>
                                </Stack>
                                {i != Object.keys(responses).length && <Divider />}
                            </React.Fragment>
                        );
                    })}
                </Paper>
            </Stack>
        </Stack>
    );
}

function ResponseStatusCode(props: { statusCode: number }) {
    return (
        <Badge variant="dot" color={props.statusCode < 300 ? 'success' : (props.statusCode < 500 ? 'warning' : 'error')}>
            <Typography sx={{ pr: 1 }}>{props.statusCode}</Typography>
        </Badge>
    );
}

function extractTags(api: OpenAPIV3.Document): string[] {
    const allTags = getOperations(api).flatMap(op => op?.operation?.tags).filter(i => typeof i === 'string') as string[];
    return allTags.filter((v, i, s) => s.indexOf(v) === i);
}

function Nav() {
    const api = useContext(ApiContext);
    const [tagName, setTagName] = useHashParam('tag');
    const [pathName, setPathName] = useHashParam('path');
    const [operationName, setOperationName] = useHashParam('op');

    if (!api) throw 'API undefined';
    const { info } = api;

    const tags = api.tags?.map(t => t.name) ?? extractTags(api);
    const operations = getOperations(api);

    const handleItemSelected = async (_: React.SyntheticEvent, newValue: string) => {
        const newTagName = newValue.startsWith('tag-') ? newValue.substring(4) : undefined;
        if (tagName !== newTagName) {
            await setTagName(newTagName);
        }

        const newPath = newValue.startsWith('path-') ? newValue.substring(5, newValue.lastIndexOf('-')) : undefined;
        if (pathName !== newPath) {
            await setPathName(newPath);
        }

        const newOperation = newValue.startsWith('path-') ? newValue.substring(newValue.lastIndexOf('-') + 1) : undefined;
        if (operationName !== newOperation) {
            await setOperationName(newOperation);
        }
    }

    return (
        <Stack spacing={2}>
            <Stack alignItems="center" direction="row" spacing={1}>
                <Typography>{info.title}</Typography>
                <Chip size="sm" variant="soft">v{info.version}</Chip>
                {info.license && <Chip size="sm">{info.license.name}</Chip>}
            </Stack>
            <TreeView
                onNodeSelect={handleItemSelected}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ overflowY: 'auto' }}>
                {tags.map(t => (
                    <TreeItem key={t} nodeId={`tag-${t}`} label={t}>
                        {operations.filter(op => (op.operation.tags?.indexOf(t) ?? -1) >= 0).map(op => (
                            <TreeItem key={`nav-route-${op.pathName}-${op.operationName}`} nodeId={`path-${op.pathName}-${op.operationName}`} label={(
                                <Stack sx={{ py: 0.5 }} direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                    <Typography noWrap level="body2">{op.pathName}</Typography>
                                    <OperationChip operation={op.operationName} small />
                                </Stack>
                            )} />
                        ))}
                    </TreeItem>
                ))}
            </TreeView>
        </Stack>
    );
}

function NavSkeleton() {
    return <Stack>
        <Skeleton width="80%" />
    </Stack>
}

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
    return Object.keys(api.paths).flatMap((pathName) => {
        const path = api.paths[pathName];
        if (!path) return Array<GetOperationResult>();
        return enumKeys(OpenAPIV3.HttpMethods).map(opName => {
            const httpOperation = OpenAPIV3.HttpMethods[opName] as OpenAPIV3.HttpMethods;
            const pathOperation = path[httpOperation] as OpenAPIV3.OperationObject;
            if (!pathOperation) return undefined;

            return { pathName: pathName, operationName: opName, httpOperation: httpOperation, operation: pathOperation };
        });
    }).filter(i => typeof i !== 'undefined') as GetOperationResult[];
}

function Route() {
    const api = useContext(ApiContext);
    const [tagName] = useHashParam('tag');
    const [pathName] = useHashParam('path');
    const [operation] = useHashParam('op');

    if (api == null)
        return <Typography>Select action from navigation bar</Typography>

    const pathOperations = getOperations(api)
        .filter(i => typeof tagName === 'undefined' || (i.operation.tags?.map(i => i.toLowerCase()).indexOf(tagName.toLowerCase()) ?? -1) >= 0)
        .filter(i => typeof pathName === 'undefined' || (i.pathName.toLowerCase() === pathName.toLowerCase()))
        .filter(i => typeof operation === 'undefined' || (i.operationName.toLowerCase() === operation.toLowerCase()));

    return (
        <Stack py={2} spacing={20}>
            {pathOperations.map(({ pathName, operationName, httpOperation, operation }) => (
                <Grid container key={`path-${pathName}-${operationName}`}>
                    <Grid item xs={6} sx={{ px: 2 }}>
                        <ApiOperation path={pathName} operation={httpOperation} info={operation} />
                    </Grid>
                    <Grid item xs={6} sx={{ px: 2 }}>
                        <Actions path={pathName} operation={httpOperation} info={operation} />
                    </Grid>
                </Grid>
            ))}
        </Stack>
    );
}

type ActionsProps = ApiOperationProps;

const useSecurityInfo = (requirements: OpenAPIV3.SecurityRequirementObject) => {
    const api = useContext(ApiContext);
    if (!api) throw 'API undefined';
    const types = Object.keys(requirements);
    return types
        .map(type => api.components && api.components.securitySchemes && api.components.securitySchemes[type])
        .map(t => resolveRef<OpenAPIV3.SecuritySchemeObject>(api, t));
};

function SecurityInput(props: { security: OpenAPIV3.SecurityRequirementObject }) {
    const { security } = props;
    const info = useSecurityInfo(security);
    return (
        <>
            {info.map(source => {
                if (source && source.type === 'http') {
                    const httpSource = source as OpenAPIV3.HttpSecurityScheme;
                    return (
                        <Stack key={httpSource.scheme}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                {httpSource.description && <Typography level="body2">{httpSource.description}</Typography>}
                                {httpSource.bearerFormat && <Typography level="body2">{httpSource.bearerFormat}</Typography>}
                            </Stack>
                            <TextField size="sm" variant="soft" placeholder="Empty" label={camelToSentenceCase(httpSource.scheme)}></TextField>
                        </Stack>
                    );
                } else if (source) {
                    return <Typography key={source.type} color="danger" fontWeight="bold"  textTransform="uppercase">{'Not supported security type "' + source.type + '"'}</Typography>
                } else {
                    return <Typography key="unknown" color="danger" fontWeight="bold"  textTransform="uppercase">Security not defined</Typography>
                }
            })}
        </>
    );
}

function SecurityBadge(props: { security: OpenAPIV3.SecurityRequirementObject }) {
    const { security } = props;
    const info = useSecurityInfo(security);
    return (
        <>
            {info.map(source => {
                if (source && source.type === 'http') {
                    const httpSource = source as OpenAPIV3.HttpSecurityScheme;
                    return <Chip variant="outlined" startDecorator={<SecurityIcon fontSize="small" />} key={httpSource.scheme}>{camelToSentenceCase(httpSource.scheme)}</Chip>;
                } else if (source) {
                    return <Typography key={source.type} color="danger" fontWeight="bold"  textTransform="uppercase">{'Not supported security type "' + source.type + '"'}</Typography>
                } else {
                    return <Typography key="unknown" color="danger" fontWeight="bold" textTransform="uppercase">Security not defined</Typography>
                }
            })}
        </>
    );
}

function Actions(props: ActionsProps) {
    const { info } = props;
    const api = useContext(ApiContext);
    const [selectedServer, setSelectedServer] = useHashParam('server');

    if (!api) throw 'API undefined';
    const { servers } = api;
    const selectedServerUrl = selectedServer ?? (servers && servers.length > 0 ? servers[0].url : 'https://example.com');

    const { requestBody, security } = info;
    const requestBodyResolved = requestBody && resolveRef(api, requestBody);
    const [requestBodyValue, setRequestBodyValue] = useState(requestBodyResolved ? JSON.stringify(schemaToJson(api, requestBodyResolved.content['application/json'].schema), undefined, 2) : '');

    const [response, setResponse] = useState('');
    const [responseStatusCode, setResponseStatusCode] = useState<number | undefined>(undefined);
    const requestUrl = selectedServerUrl + props.path;
    const handleExecuteAction = async () => {
        try {
            const response = await axios.request({
                url: requestUrl,
                method: props.operation.toString() as Method,
                data: props.operation !== 'get' ? requestBodyValue : undefined,
                // params: props.operation === "get" ? data : undefined,
                headers: {
                    //   Authorization: token,
                    //   "Content-Type": "application/json",
                    //   ...headers
                },
            });
            setResponseStatusCode(response.status);
            setResponse(JSON.stringify(response.data, undefined, 2));
        } catch (err) {
            if (typeof err === 'object' && Object.keys(err as object).find(key => key === 'isAxiosError')) {
                const axiosError = err as AxiosError;
                console.log(axiosError.response?.status, axiosError.response?.data)
                setResponseStatusCode(axiosError.response?.status);
                setResponse(JSON.stringify(axiosError.response?.data, undefined, 2));
            } else {
                setResponseStatusCode(999);
                setResponse('Unknown error');
            }
        }
    };

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
                                    {server.description && <Typography noWrap  level="body2">{server.url}</Typography>}
                                </Stack>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>}
            <CopyToClipboardInput id="base-address" label="Base address" fullWidth sx={{ fontFamily: 'Courier New, Courier, Lucida Sans Typewriter, Lucida Typewriter, monospace', fontSize: '0.8em' }} value={selectedServerUrl} />
            {security && (
                <Stack spacing={1}>
                    <Typography textTransform="uppercase">Authentication</Typography>
                    <Stack>
                        {security.map((securityVariant, i) => <SecurityInput key={i} security={securityVariant} />)}
                    </Stack>
                </Stack>
            )}
            {requestBodyResolved && (
                <Stack spacing={1}>
                    <Typography textTransform="uppercase">Body</Typography>
                    <Stack>
                        <Typography textAlign="right"  level="body3">application/json</Typography>
                        <Paper variant="outlined">
                            <CodeEditor language="json" code={requestBodyValue} setCode={setRequestBodyValue} height={300} />
                        </Paper>
                    </Stack>
                </Stack>
            )}
            <Button variant="outlined" startIcon={<SendIcon />} onClick={handleExecuteAction}>Run</Button>
            {responseStatusCode && (
                <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography textTransform="uppercase">Response</Typography>
                        <ResponseStatusCode statusCode={responseStatusCode} />
                    </Stack>
                    <Paper variant="outlined">
                        <CodeEditor language="json" code={response || 'Empty response'} height={200} readonly />
                    </Paper>
                </Stack>
            )}
        </Stack>
    );
}

async function getOpenApiDoc(url: string) {
    return (await axios.get<OpenAPIV3.Document>(url)).data;
}

const ApiContext = createContext<OpenAPIV3.Document | undefined>(undefined);

function DocsApiPage() {
    const url = appSettingsProvider.isDeveloper
        ? 'https://api.signalco.dev/api/swagger.json'
        : 'https://api.signalco.io/api/swagger.json';
    const apiRequest = useCallback(() => getOpenApiDoc(url), [url]);
    const { item: api, isLoading, error } = useLoadAndError<OpenAPIV3.Document>(apiRequest);

    console.info('OpenAPI scheme: ', api);

    return (
        <ApiContext.Provider value={api}>
            <Stack>
                {error && (
                    <Alert severity="error" variant="filled" sx={{ borderRadius: 0 }}>
                        <AlertTitle>{'Couldn\'t load OpenAPI docs'}</AlertTitle>
                        {error}
                    </Alert>
                )}
                <Stack direction="row" alignItems="stretch">
                    <Box sx={{ minWidth: { xs: '230px', md: '320px' }, px: 2, py: 4 }}>
                        {isLoading || !api ? <NavSkeleton /> : <Nav />}
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box flexGrow={1}>
                        <Route />
                    </Box>
                </Stack>
            </Stack>
        </ApiContext.Provider>
    );
}

DocsApiPage.layout = PageFullLayout;

export default DocsApiPage;
