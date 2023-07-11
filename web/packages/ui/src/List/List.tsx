import { PropsWithChildren } from "react";
import { Stack } from "../Stack";

export function List({ children }: PropsWithChildren) {
    return (
        <Stack>
            {children}
        </Stack>
    );
}
