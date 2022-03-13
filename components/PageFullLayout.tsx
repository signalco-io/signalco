import { Box, Stack } from "@mui/material";
import React from "react";
import { ChildrenProps } from "../src/sharedTypes";
import Footer from "./pages/Footer";
import { PageNavSsr } from "./PageNavSsr";
import { PageNav } from "./PageNav";


export function PageFullLayout(props: ChildrenProps) {
    const Nav = typeof window !== 'undefined' ? PageNav : PageNavSsr;

    return (
        <Stack>
            <Nav fullWidth />
            <Box>
                {props.children}
            </Box>
            <Footer />
        </Stack>);
}
