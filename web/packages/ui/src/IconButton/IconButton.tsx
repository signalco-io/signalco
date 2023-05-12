import type { ComponentProps } from "react";
import { Button } from "../Button";

export function IconButton(props: ComponentProps<typeof Button>) {
    return <Button {...props} />;
}
