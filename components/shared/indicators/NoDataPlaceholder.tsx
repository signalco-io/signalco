import { Typography } from "@mui/material";

const NoDataPlaceholder = ({ content }: { content: React.ReactNode | string }) => (
    <Typography variant="subtitle2" color="textSecondary">{content}</Typography>
);

export default NoDataPlaceholder;