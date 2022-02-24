import { TreeItem, TreeView } from "@mui/lab";
import { Chip, Divider, Grid, OutlinedInput, Paper, Stack, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import axios from "axios";
import { useEffect, useState } from "react";
import { PageFullLayout } from "../../../components/AppLayout";

const ApiParam = (props: {name: string, dataType: string, description: string | undefined}) => (
    <Stack sx={{px: 2, py: 2}} direction="row" alignItems="center" justifyContent="space-between">
        <Stack>
            <Stack direction="row" alignItems="end" spacing={1}>
                <Typography fontWeight="bold">{props.name}</Typography>
                <Typography variant="caption" color="textSecondary">{props.dataType}</Typography>
            </Stack>
            {(props.description?.length ?? 0) > 0 && <Typography color="textSecondary">{props.description}</Typography>}
        </Stack>
        {props.dataType === 'string' || props.dataType === 'number' ? (
            <OutlinedInput size="small" />
        ) : (
            <Typography color={red[400]} fontWeight="bold" variant="overline">{"Not supported data type '" + props.dataType + "'"}</Typography>
        )}
    </Stack>
);

type ApiParamInfo = {
    name: string,
    dataType: string,
    description: string | undefined
}

const ApiParams = (props: {header: string, params: ApiParamInfo[]}) => (
    <Stack spacing={1}>
        <Typography variant="overline">{props.header}</Typography>
        <Paper variant="outlined">
            <Stack>
                {props.params.map((param, i) => (
                    <>
                        <ApiParam key={param.name} {...param} />
                        {i !== props.params.length -1 && <Divider />}
                    </>
                ))}
            </Stack>
        </Paper>
    </Stack>
);

type ApiRouteInfo = {
    id: string,
    path: string,
    fullPath: string,
    operation: string,
    description?: string | undefined,
    tags?: string[] | undefined,
    requestBody?: ApiParamInfo[] | undefined
};

const ApiRoute = (props: {route: ApiRouteInfo | undefined}) => {
    const {route} = props;

    return (
        <Stack spacing={4}>
            <Stack spacing={1}>
                <Typography variant="h2">{route?.path}</Typography>
                <Stack spacing={1} direction="row" alignItems="center">
                    <Chip color="success" label={route?.operation} size="small" />
                    <Typography variant="caption" color="textSecondary">{route?.fullPath}</Typography>
                </Stack>
            </Stack>
            <Typography variant="body1">{route?.description}</Typography>
            {/* <ApiParams header="Headers" params={[{name: 'email', dataType: 'string', description: undefined}, {name: 'email', dataType: 'string', description: undefined}]} /> */}
            {/* <ApiParams header="Query" />
            <ApiParams header="Body" />
            <ApiParams header="Responses" /> */}
            {route?.requestBody && <ApiParams header="Body" params={route?.requestBody} />}
        </Stack>
    );
};

const useOpenApiJson = (url: string): {routes: ApiRouteInfo[] | undefined} => {
    const [api, setApi] = useState<any | undefined>(undefined);

    useEffect(() => {
        const loadApi = async () => {
            const response = await axios.get(url);
            setApi(response.data);
            console.debug('API', response.data);
        };

        loadApi();
    }, [url]);

    return {
        routes: api ? Object.keys(api.paths).flatMap(path => Object.keys(api.paths[path]).map(op => {
            const route = api.paths[path][op];

            const getRef = (source: any) => {
                const ref = source.content["application/json"].schema.$ref;
                if (ref) {
                    const refPaths = ref.split('/');
                    let current = api;
                    for(let i = 1; i < refPaths.length; i++) {
                        current = current[refPaths[i]];
                    }
                    return current;
                }
                return undefined;
            }

            let bodyProps = undefined;
            const body = route.requestBody ? getRef(route.requestBody)?.properties : undefined;
            if (body) {
                bodyProps = Object.keys(body).map(prop => ({
                    name: prop,
                    dataType: body[prop].type,
                    description: body[prop].description
                }));
            }

            return ({
                id: route.operationId,
                path: path,
                operation: op,
                fullPath: api.servers[0].url + path,
                description: route.description,
                requestBody: bodyProps
            });
        })) : undefined
    };
};

const DocsApiPage = () => {
    const api = useOpenApiJson("https://api.signalco.io/api/swagger.json");
    const [selectedRoute, setSelectedRoute] = useState<ApiRouteInfo | undefined>(undefined);

    useEffect(() => {
        if (selectedRoute == null && api.routes && api.routes.length > 0) {
            setSelectedRoute(api.routes[0]);
        }
    }, [api, selectedRoute]);

    const handleRouteSelect = (_, nodes) => setSelectedRoute(api.routes?.find(r => r.id === nodes));

    return (
        <Grid container>
            <Grid item xs={2} sx={{ borderRight: "1px solid", borderColor: 'divider' }}>
                <Stack spacing={2}>
                    <Typography>Public cloud API</Typography>
                    <TreeView onNodeSelect={handleRouteSelect}>
                        {api.routes?.map(route => (
                            <TreeItem key={route.id} nodeId={route.id} label={route.path} />
                        ))}
                    </TreeView>
                </Stack>
            </Grid>
            <Grid item xs={6} sx={{ p: 4 }}>
                <ApiRoute route={selectedRoute} />
            </Grid>
            <Grid item xs={4} sx={{ borderLeft: "1px solid", borderColor: 'divider' }}>
                <div>response</div>
            </Grid>
        </Grid>
    );
};

DocsApiPage.layout = PageFullLayout;

export default DocsApiPage;