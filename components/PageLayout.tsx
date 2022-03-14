import { Box, Container, Stack } from "@mui/material";
import React from "react";
import { ChildrenProps } from "../src/sharedTypes";
import Footer from "./pages/Footer";
import { PageNavSsr } from "./PageNavSsr";
import { PageNav } from "./PageNav";


export function PageLayout(props: ChildrenProps) {
    const Nav = typeof window !== 'undefined' ? PageNav : PageNavSsr;

    return (
        <Stack spacing={4}>
            <Nav />
            <Box>
                <Container>
                    {props.children}
                </Container>
            </Box>
            <Footer />
        </Stack>);
}
