import { TreeItem, TreeView } from "@mui/lab";
import { Chip, Divider, Grid, OutlinedInput, Paper, Stack, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
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

type ApiParam = {
    name: string,
    dataType: string,
    description: string | undefined
}

const ApiParams = (props: {header: string, params: ApiParam[]}) => (
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

const ApiRoute = () => (
    <Stack spacing={4}>
        <Stack spacing={1}>
            <Typography variant="h2">/api/status</Typography>
            <Stack spacing={1} direction="row" alignItems="center">
                <Chip color="success" label="GET" size="small" />
                <Typography variant="caption" color="textSecondary">https://api.signalo.io/api/status</Typography>
            </Stack>
        </Stack>
        <Typography variant="body1">
            Fusce dolor lacus, ultrices dignissim iaculis non, pulvinar ac magna. Quisque ac nisl diam. Phasellus quis felis ut quam interdum accumsan eget in velit. Suspendisse potenti. Praesent ac elit ex. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam purus neque, ullamcorper in lobortis et, tincidunt et mauris. Integer nec dignissim velit. Morbi vestibulum urna in sapien interdum, vel tempor tellus posuere. Sed eleifend ac lorem a laoreet. Donec lobortis nulla magna, vel elementum est porta a.
        </Typography>
        <ApiParams header="Headers" params={[{name: 'email', dataType: 'string', description: undefined}, {name: 'email', dataType: 'string', description: undefined}]} />
        {/* <ApiParams header="Query" />
        <ApiParams header="Body" />
        <ApiParams header="Responses" /> */}
    </Stack>
);

const DocsApiPage = () => (
    <Grid container>
        <Grid item xs={2} sx={{borderRight: "1px solid", borderColor: 'divider'}}>
            <Stack spacing={2}>
                <Typography>Public cloud API</Typography>
                <TreeView>
                    <TreeItem nodeId={"1"} label="Item 1"></TreeItem>
                </TreeView>
            </Stack>
        </Grid>
        <Grid item xs={6} sx={{p: 4}}>
            <ApiRoute />
        </Grid>
        <Grid item xs={4}  sx={{borderLeft: "1px solid", borderColor: 'divider'}}>
            <div>response</div>
        </Grid>
    </Grid>
);

DocsApiPage.layout = PageFullLayout;

export default DocsApiPage;