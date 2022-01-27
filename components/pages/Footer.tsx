import { Box, Divider, Container, Grid, Typography, Stack, IconButton } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "../../pages/_app";
import GitHubIcon from '@mui/icons-material/GitHub';
import SignalcoLogo from "../icons/SignalcoLogo";

const Footer = () => {
    const appContext = useContext(AppContext);

    return (
        <Box sx={{ backgroundColor: appContext.theme === 'light' ? "rgba(0,0,0,0.06)" : "rgba(125,125,125,0.2)" }}>
            <Divider />
            <Container maxWidth="lg">
                <Box component="footer" sx={{ padding: "64px 0 32px 0" }}>
                    <Grid container direction="column" spacing={4}>
                        <Grid item>
                            <Grid container justifyContent="space-between" spacing={2}>
                                <Grid item>
                                    <Typography variant="h4" sx={{ pb: 2 }}>Projects</Typography>
                                    <Stack>
                                        <Link href="https://github.com/signalco-io/signalco">Website</Link>
                                        <Link href="https://github.com/signalco-io/cloud">Cloud</Link>
                                        <Link href="https://github.com/signalco-io/station">Station</Link>
                                    </Stack>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h4" sx={{ pb: 2 }}>Community</Typography>
                                    <Typography variant="caption" color="textSecondary">Coming soon...</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h4" sx={{ pb: 2 }}>Resources</Typography>
                                    <Stack>
                                        <Link href="https://status.signalco.io">Status</Link>
                                        <Link href="https://storybook.dev.signalco.io">Storybook</Link>
                                    </Stack>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h4" sx={{ pb: 2 }}>Legal</Typography>
                                    <Stack>
                                        <Link href="/legal/privacy-policy">Privacy Policy</Link>
                                        <Link href="/legal/terms-of-service">Terms of Service</Link>
                                        <Link href="/legal/dpa">DPA</Link>
                                        <Link href="/legal/sla">SLA</Link>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <SignalcoLogo height={68} />
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Typography variant="subtitle2" fontWeight={400} component="span" color="textSecondary">Copyright © {new Date().getFullYear()} signalco. All rights reserved.</Typography>
                                </Grid>
                                <Grid item>
                                    <Link href="https://github.com/signalco-io/signalco" passHref>
                                        <IconButton size="large" aria-label="GitHub link">
                                            <GitHubIcon />
                                        </IconButton>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;