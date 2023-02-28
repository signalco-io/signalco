import { Warning } from "@signalco/ui-icons";
import { Component, ErrorInfo } from "react";
import Alert from "../Alert";
import { ChildrenProps } from "../sharedTypes";

export default class ErrorBoundary extends Component<ChildrenProps, { hasError: boolean }> {
    constructor(props: ChildrenProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBOundary catched", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Alert variant="soft" color="danger" sx={{ width: '100%' }} startDecorator={<Warning />}>
                    Something went wrong.
                </Alert>
            );
        }

        return this.props.children;
    }
}
