import { Paper } from "@mui/material";

const WidgetCard = (props: { width: number, height: number, state: boolean }) => {
    const sizeWidth = props.width * 78 + (props.width - 1) * 8;
    const sizeHeight = props.height * 78 + (props.height - 1) * 8;

    return (
        <Paper sx={{ borderRadius: 2, width: sizeWidth, height: sizeHeight, display: "block" }} variant="elevation" elevation={props.state ? 1 : 0} >

        </Paper >
    );
}

const WidgetState = (props: { width: number, height: number }) => {
    return (
        <WidgetCard width={props.width} height={props.height} state={false} />
    );
};

export default WidgetState;