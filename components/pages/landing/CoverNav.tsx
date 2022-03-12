import { Stack, Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function CoverNav() {
    return (
        <Stack justifyContent="center" direction="row" spacing={{ xs: 4, md: 8 }}>
            <Box sx={{ width: '150px', textAlign: 'center', textDecoration: 'none' }}>
                <Link passHref href="/app">
                    <Button size="large">
                        <Typography variant="h2">Automate</Typography>
                    </Button>
                </Link>
            </Box>
            <Box sx={{ width: '150px', textAlign: 'center', textDecoration: 'none' }}>
                <Link passHref href="#">
                    <Button size="large">
                        <Typography variant="h2">Explore</Typography>
                    </Button>
                </Link>
            </Box>
            <Box sx={{ width: '150px', textAlign: 'center', textDecoration: 'none' }}>
                <Link passHref href="#">
                    <Button size="large">
                        <Typography variant="h2">Community</Typography>
                    </Button>
                </Link>
            </Box>
        </Stack>
    );
}