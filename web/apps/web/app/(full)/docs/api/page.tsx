'use client';

import React, { useCallback, useState, useContext, createContext, Suspense, Fragment } from 'react';
import { OpenAPIV3 } from 'openapi-types';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { SelectItems } from '@signalco/ui-primitives/SelectItems';
import { Row } from '@signalco/ui-primitives/Row';
import { ListTreeItem } from '@signalco/ui-primitives/ListTreeItem';
import { List } from '@signalco/ui-primitives/List';
import { Input } from '@signalco/ui-primitives/Input';
import { Divider } from '@signalco/ui-primitives/Divider';
import { cx } from '@signalco/ui-primitives/cx';
import { Chip } from '@signalco/ui-primitives/Chip';
import { Card, CardOverflow } from '@signalco/ui-primitives/Card';
import { Button } from '@signalco/ui-primitives/Button';
import { Security, Send } from '@signalco/ui-icons';
import type { ColorPaletteProp } from '@signalco/ui/theme';
import { SplitView } from '@signalco/ui/SplitView';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { Loadable } from '@signalco/ui/Loadable';
import { CopyToClipboardInput } from '@signalco/ui/CopyToClipboardInput';
import { Alert } from '@signalco/ui/Alert';
import { camelToSentenceCase, HttpOperation, ObjectDictAny, objectWithKey } from '@signalco/js';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { usePromise } from '@enterwell/react-hooks';
import { isDeveloper } from '../../../../src/services/EnvProvider';

function HttpOperationChip(props: { operation?: HttpOperation | undefined, small?: boolean }) {
    const color = ({
        'get': 'success',
        'post': 'info',
        'put': 'warning',
        'delete': 'danger'
    }[props.operation?.toLowerCase() ?? ''] ?? 'neutral') as ColorPaletteProp;

    return <Chip color={color} size={props.small ? 'sm' : 'md'}>{props.operation?.toUpperCase()}</Chip>;
}

type ApiOperationProps = { path: string, operation: OpenAPIV3.HttpMethods, info: OpenAPIV3.OperationObject };

function schemaToJson(api: OpenAPIV3.Document, schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined): unknown | undefined {
    const schemaObj = resolveRef(api, schema);
    if (typeof schemaObj === 'undefined') return undefined;

    switch (schemaObj.type) {
        case 'string':
            return '';
        case 'boolean': return true;
        case 'number':
        case 'integer': return 0;
        case 'object': {
            if (typeof schemaObj.properties === 'undefined') {
                return ({});
            }
            const curr: ObjectDictAny = {};
            Object.keys(schemaObj.properties).forEach(prop => {
                if (schemaObj.properties) {
                    curr[prop] = schemaToJson(api, schemaObj.properties[prop]);
                }
            });
            return curr;
        }
        case 'array': {
            const arraySchema = schemaObj as OpenAPIV3.ArraySchemaObject;
            return [schemaToJson(api, arraySchema.items)];
        }
        default: return undefined;
    }
}

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
    return <Typography key={props.name} color="danger" bold>{'Not supported property type "array"'}</Typography>
}

function Schema(props: { name: string, schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined }) {
    const api = useContext(ApiContext);
    if (!api) throw 'API is undefined';

    const schemaResolved = resolveRef(api, props.schema);

    return (
        <div>
            <Row spacing={1}>
                <Typography>{props.name}</Typography>
                <Typography level="body2">{schemaResolved?.type}</Typography>
            </Row>
            <div className="border-l px-2">
                {schemaResolved?.type === 'array'
                    ? <ArraySchema name={props.name} schema={schemaResolved as OpenAPIV3.ArraySchemaObject} />
                    : <NonArraySchema name={props.name} schema={schemaResolved as OpenAPIV3.NonArraySchemaObject} />}
            </div>
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
                <Row spacing={1}>
                    <HttpOperationChip operation={operation} />
                    <Typography
                        level="h6"
                        title={deprecated ? 'Deprecated' : undefined}
                        className={cx(deprecated && 'line-through')}>
                        {path}
                    </Typography>
                </Row>
                <Row spacing={1}>
                    {security && security.map((securityVariant, i) => <SecurityBadge key={i} security={securityVariant} />)}
                    {tags && tags.map(tag => <Chip key={tag}>{tag}</Chip>)}
                </Row>
            </Stack>
            {summary && <Typography>{summary}</Typography>}
            {description && <Typography level="body2">{description}</Typography>}
            {externalDocs && (
                <Stack>
                    {externalDocs.description && <Typography>{externalDocs.description}</Typography>}
                    <NavigatingButton href={externalDocs.url}>More info</NavigatingButton>
                </Stack>
            )}
            {parametersResolved && (
                <Stack spacing={1}>
                    <Typography uppercase>Parameters</Typography>
                    <Card>
                        {parametersResolved.map((parameter, index) => (
                            <React.Fragment key={parameter.name}>
                                <div className="p-2">
                                    <Stack>
                                        <Row spacing={1} justifyContent="space-between">
                                            <Typography semiBold mono>{parameter.name}</Typography>
                                            <Typography level="body2" uppercase>{parameter.in}</Typography>
                                        </Row>
                                        {parameter.description && <Typography level="body2">{parameter.description}</Typography>}
                                    </Stack>
                                </div>
                                {index != Object.keys(parametersResolved).length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </Card>
                </Stack>
            )}
            {requestBodyResolved && (
                <Stack spacing={1}>
                    <Typography uppercase>Request body</Typography>
                    {requestBodyResolved.description && <Typography level="body2">{requestBodyResolved.description}</Typography>}
                    <Card>
                        <Stack>
                            {Object.keys(requestBodyResolved.content).map(contentType => (
                                <React.Fragment key={contentType}>
                                    {requestBodyResolved.content[contentType]?.schema &&
                                        <Schema name={contentType} schema={requestBodyResolved.content[contentType]?.schema} />}
                                </React.Fragment>
                            ))}
                        </Stack>
                    </Card>
                </Stack>
            )}
            <Stack spacing={1}>
                <Typography uppercase>Responses</Typography>
                <Card>
                    {Object.keys(responses).map((responseCode, i) => {
                        const responseCodeNumber = parseInt(responseCode, 10) || 0;
                        const responseObj = resolveRef<OpenAPIV3.ResponseObject>(api, responses[responseCode]);
                        if (!responseObj) return undefined;
                        return (
                            <React.Fragment key={responseCode}>
                                <div className="p-2">
                                    <Stack>
                                        <ResponseStatusCode statusCode={responseCodeNumber} />
                                        <Typography level="body2">{responseObj.description}</Typography>
                                    </Stack>
                                </div>
                                {i != (Object.keys(responses).length - 1) && <Divider />}
                            </React.Fragment>
                        );
                    })}
                </Card>
            </Stack>
        </Stack>
    );
}

function ResponseStatusCode(props: { statusCode: number }) {
    return (
        <Row spacing={1}>
            <Chip color={props.statusCode < 300 ? 'success' : (props.statusCode < 500 ? 'warning' : 'error')} />
            <Typography>{props.statusCode}</Typography>
        </Row>
    );
}

function extractTags(api: OpenAPIV3.Document): string[] {
    const allTags = getOperations(api).flatMap(op => op?.operation?.tags).filter(i => typeof i === 'string') as string[];
    return allTags.filter((v, i, s) => s.indexOf(v) === i);
}

function Nav() {
    const api = useContext(ApiContext);
    const router = useRouter();
    const searchParams = useSearchParams();
    const tagName = searchParams.get('tag');
    const pathName = searchParams.get('path');
    const operationName = searchParams.get('op') as HttpOperation | undefined;

    if (!api) throw 'API undefined';
    const { info } = api;

    const tags = api.tags?.map(t => t.name) ?? extractTags(api);
    const operations = getOperations(api);

    const handleItemSelected = async (newValue: string) => {
        const newTagName = newValue.startsWith('tag-') ? newValue.substring(4) : undefined;
        const newPath = newValue.startsWith('path-') ? newValue.substring(5, newValue.lastIndexOf('-')) : undefined;
        const newOperation = newValue.startsWith('op-') ? newValue.substring(newValue.lastIndexOf('-') + 1) : undefined;

        const newSearchParams = new URLSearchParams({ ...searchParams.entries });
        if (newTagName) newSearchParams.set('tag', newTagName); else newSearchParams.delete('tag');
        if (newPath) newSearchParams.set('path', newPath); else newSearchParams.delete('path');
        if (newOperation) newSearchParams.set('op', newOperation); else newSearchParams.delete('op');
        const newUrl = new URL(window.location.href);
        newUrl.search = newSearchParams.toString();
        router.push(newUrl.toString())
    }

    return (
        <Stack spacing={2} className="p-4">
            <Row spacing={1}>
                <Typography>{info.title}</Typography>
                <Chip size="sm" variant="soft">
                    <Typography level="body3">v{info.version}</Typography>
                </Chip>
                {info.license && <Chip size="sm">{info.license.name}</Chip>}
            </Row>
            <List>
                {tags.map(t => (
                    <ListTreeItem
                        key={t}
                        nodeId={`tag-${t}`}
                        label={t}
                        selected={tagName === t}
                        onSelected={handleItemSelected}>
                        {operations.filter(op => (op.operation.tags?.indexOf(t) ?? -1) >= 0).map(op => (
                            <ListTreeItem
                                key={`nav-route-${op.pathName}-${op.operationName}`}
                                nodeId={`path-${op.pathName}-${op.operationName}`}
                                selected={pathName === op.pathName && operationName === op.operationName}
                                onSelected={handleItemSelected}
                                label={(
                                    <div className="py-1">
                                        <Row justifyContent="space-between" spacing={1}>
                                            <Typography noWrap level="body2">{op.pathName}</Typography>
                                            <HttpOperationChip operation={op.operationName} small />
                                        </Row>
                                    </div>
                                )} />
                        ))}
                    </ListTreeItem>
                ))}
            </List>
        </Stack>
    );
}

function resolveRef<T>(api: OpenAPIV3.Document, obj: T | OpenAPIV3.ReferenceObject | undefined) {
    if (typeof obj === 'undefined') return undefined;
    const refObj = obj as OpenAPIV3.ReferenceObject;
    if (typeof refObj.$ref === 'undefined') return obj as T;
    const refSplit = refObj.$ref.split('/')
    if (refSplit.length <= 1 || refSplit[0] !== '#')
        return obj as T; // Don't support relative for now
    let curr: unknown = api;
    for (let i = 1; i < refSplit.length && typeof curr !== 'undefined'; i++) {
        const nextKey = refSplit[i];
        if (!nextKey) {
            break;
        }
        const next = objectWithKey(curr, nextKey)?.nextKey;
        if (next == null) {
            break;
        }
        curr = next;
    }
    return curr as unknown as T;
}

type GetOperationResult = { pathName: string, operationName: HttpOperation, httpOperation: OpenAPIV3.HttpMethods, operation: OpenAPIV3.OperationObject }

function getOperations(api: OpenAPIV3.Document): Array<GetOperationResult> {
    return Object.keys(api.paths).flatMap((pathName) => {
        const path = api.paths[pathName];
        if (!path) return Array<GetOperationResult>();
        return Object.values(OpenAPIV3.HttpMethods).map(opName => {
            const pathOperation = path[opName] as OpenAPIV3.OperationObject;
            if (!pathOperation) return undefined;

            return { pathName: pathName, operationName: opName, httpOperation: opName, operation: pathOperation };
        });
    }).filter(i => typeof i !== 'undefined') as GetOperationResult[];
}

function Route() {
    const api = useContext(ApiContext);
    const [tagName] = useSearchParam('tag');
    const [pathName] = useSearchParam('path');
    const [operationName] = useSearchParam('op');

    if (api == null)
        return <Typography className="p-8 text-center">Select action from navigation bar</Typography>

    const pathOperations = getOperations(api)
        .filter(i => typeof tagName === 'undefined' || (i.operation.tags?.map(i => i.toLowerCase()).indexOf(tagName.toLowerCase()) ?? -1) >= 0)
        .filter(i => typeof pathName === 'undefined' || (i.pathName.toLowerCase() === pathName.toLowerCase()))
        .filter(i => typeof operationName === 'undefined' || (i.operationName.toLowerCase() === operationName.toLowerCase()));

    return (
        <div className="p-4">
            <Stack spacing={6}>
                {pathOperations.map(({ pathName, operationName, httpOperation, operation }, index) => (
                    <Fragment key={`path-${pathName}-${operationName}`}>
                        <div key={`path-${pathName}-${operationName}`}>
                            <Row spacing={2} alignItems="start">
                                <div className="grow">
                                    <ApiOperation path={pathName} operation={httpOperation} info={operation} />
                                </div>
                                <div className="w-1/3">
                                    <Actions path={pathName} operation={httpOperation} info={operation} />
                                </div>
                            </Row>
                        </div>
                        {index != pathOperations.length - 1 && <Divider />}
                    </Fragment>
                ))}
            </Stack>
        </div>
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
                            <Row justifyContent="space-between">
                                {httpSource.description && <Typography level="body2">{httpSource.description}</Typography>}
                                {httpSource.bearerFormat && <Typography level="body2">{httpSource.bearerFormat}</Typography>}
                            </Row>
                            <Input
                                placeholder="Empty"
                                label={camelToSentenceCase(httpSource.scheme)} />
                        </Stack>
                    );
                } else if (source) {
                    return <Typography key={source.type} color="danger" bold uppercase>{'Not supported security type "' + source.type + '"'}</Typography>
                } else {
                    return <Typography key="unknown" color="danger" bold uppercase>Security not defined</Typography>
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
                    return (
                        <Chip
                            variant="outlined"
                            startDecorator={<Security size={18} />}
                            key={httpSource.scheme}>
                            {camelToSentenceCase(httpSource.scheme)}
                        </Chip>
                    );
                } else if (source) {
                    return <Typography key={source.type} color="danger" bold uppercase>{'Not supported security type "' + source.type + '"'}</Typography>
                } else {
                    return <Typography key="unknown" color="danger" bold uppercase>Security not defined</Typography>
                }
            })}
        </>
    );
}

function Actions(props: ActionsProps) {
    const { info } = props;
    const api = useContext(ApiContext);
    const selectedServer = undefined; // TODO: Implement server switching

    if (!api) throw 'API undefined';
    const { servers } = api;
    const selectedServerUrl = selectedServer ?? (servers && servers.length > 0 ? servers[0]?.url : 'https://example.com');

    const { requestBody, security } = info;
    const requestBodyResolved = requestBody && resolveRef(api, requestBody);
    const [requestBodyValue, setRequestBodyValue] = useState(requestBodyResolved ? JSON.stringify(schemaToJson(api, requestBodyResolved.content['application/json']?.schema), undefined, 2) : '');

    const [response, setResponse] = useState('');
    const [responseStatusCode, setResponseStatusCode] = useState<number | undefined>(undefined);
    const requestUrl = selectedServerUrl + props.path;
    const handleExecuteAction = async () => {
        try {
            // TODO: Attach params
            // TODO: Attach body
            // TODO: Attach headers
            const response = await fetch(requestUrl, {
                method: props.operation.toString(),
                // param: props.operation !== 'get' ? requestBodyValue : undefined,
                // params: props.operation === "get" ? data : undefined,
                headers: {
                    //   Authorization: token,
                    //   "Content-Type": "application/json",
                    //   ...headers
                },
            });
            setResponseStatusCode(response.status);

            const data = await response.json();
            setResponse(JSON.stringify(data, undefined, 2));
        } catch {
            setResponseStatusCode(999);
            setResponse('Unknown error');
        }
    };

    return (
        <Stack spacing={2}>
            {servers && servers.length > 1 && (
                <SelectItems
                    label="Server"
                    value={selectedServer}
                    onValueChange={() => { console.debug('TODO implement server selection') }}
                    // onChange={(v) => setSelectedServer(v[0])}
                    items={servers.map(s => ({
                        value: s.url,
                        label: (
                            <Stack>
                                <Typography noWrap>{s.description ?? s.url}</Typography>
                                {s.description && <Typography noWrap level="body2">{s.url}</Typography>}
                            </Stack>
                        )
                    }))} />
            )}
            <CopyToClipboardInput
                id="base-address"
                label="Base address"
                className="w-full font-mono text-sm"
                value={selectedServerUrl} />
            {security && (
                <Stack spacing={1}>
                    <Typography uppercase>Authentication</Typography>
                    <Stack>
                        {security.map((securityVariant, i) => <SecurityInput key={i} security={securityVariant} />)}
                    </Stack>
                </Stack>
            )}
            {requestBodyResolved && (
                <Stack>
                    <Row spacing={1} style={{ width: '100%' }} justifyContent="space-between">
                        <div style={{ paddingBottom: '8px' }}>
                            <Typography uppercase>Body</Typography>
                        </div>
                        <div style={{ alignSelf: 'flex-end' }}>
                            <Typography className="text-right" level="body3">application/json</Typography>
                        </div>
                    </Row>
                    <Card>
                        <CardOverflow className="relative">
                            {/* TODO: Use CodeEditor component with language */}
                            {/* <CodeEditor
                                    language="json"
                                    code={requestBodyValue}
                                    setCode={setRequestBodyValue}
                                    height={300} /> */}
                            <textarea
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    fontSize: '0.8em',
                                    resize: 'none',
                                    border: 'none',
                                    background: 'transparent',
                                    padding: '0.5em'
                                }}
                                value={requestBodyValue}
                                onChange={(e) => setRequestBodyValue(e.target.value)}
                                rows={10} />
                        </CardOverflow>
                    </Card>
                </Stack>
            )}
            <Button
                color="success"
                variant="solid"
                startDecorator={<Send />}
                onClick={handleExecuteAction}>Send request</Button>
            {responseStatusCode && (
                <Stack spacing={1}>
                    <Row justifyContent="space-between">
                        <Typography uppercase>Response</Typography>
                        <ResponseStatusCode statusCode={responseStatusCode} />
                    </Row>
                    <Card>
                        {/* TODO: Use CodeEditor component with language */}
                        {/* <CodeEditor language="json" code={response || 'Empty response'} height={200} readonly /> */}
                        <textarea
                            value={response || 'Empty response'}
                            readOnly={true}
                            rows={10} />
                    </Card>
                </Stack>
            )}
        </Stack>
    );
}

async function getOpenApiDoc(url: string) {
    return (await (await fetch(url)).json()) as OpenAPIV3.Document;
}

const ApiContext = createContext<OpenAPIV3.Document | undefined>(undefined);

export default function DocsApiPage() {
    const url = isDeveloper
        ? 'https://api.signalco.dev/api/swagger.json'
        : 'https://api.signalco.io/api/swagger.json';
    const apiRequest = useCallback(() => getOpenApiDoc(url), [url]);
    const { item: api, isLoading, error } = usePromise<OpenAPIV3.Document>(apiRequest);

    console.debug('OpenAPI scheme: ', api);

    return (
        <ApiContext.Provider value={api}>
            <Stack spacing={1}>
                {error && (
                    <Alert color="danger">
                        <Typography bold>{'Couldn\'t load OpenAPI documentation'}</Typography>
                        <Typography level="body2">{error}</Typography>
                    </Alert>
                )}
                <SplitView>
                    <Loadable isLoading={isLoading || !api} loadingLabel="Loading API">
                        <Suspense>
                            <Nav />
                        </Suspense>
                    </Loadable>
                    <Suspense>
                        <Route />
                    </Suspense>
                </SplitView>
            </Stack>
        </ApiContext.Provider>
    );
}
