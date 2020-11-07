import { Paper } from "@material-ui/core";
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
        </div>
    );
};

export default HomeOverview;