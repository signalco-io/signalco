import { Box, Paper, Typography } from "@material-ui/core";
import Light from "../devices/Light";

const HomeOverview = () => {
    return (
        <div>
            <span>
                Home
            </span>
            <Paper>
                <Light />
            </Paper>
            <br />
            <Paper>
                <Box p={2}>
                <Typography variant="h4">Room</Typography>
                </Box>
                <Light inline />
                <Light inline />
                <Light inline />
            </Paper>
        </div>
    );
};

export default HomeOverview;