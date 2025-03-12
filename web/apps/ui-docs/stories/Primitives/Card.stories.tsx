import { MoreHorizontal } from "@signalco/ui-icons";
import { Button } from "@signalco/ui-primitives/Button";
import { Card, CardContent, CardHeader, CardTitle, CardOverflow, CardActions } from "@signalco/ui-primitives/Card";
import { IconButton } from "@signalco/ui-primitives/IconButton";
import { Input } from "@signalco/ui-primitives/Input";
import { Row } from "@signalco/ui-primitives/Row";
import { Stack } from "@signalco/ui-primitives/Stack";
import { StoryObj } from "@storybook/react";

export default {
    component: Card,
    tags: ['autodocs'],
    
};
type Story = StoryObj<typeof Card>;

export const Default: Story = {
    args: {
        children: (
            <>
                <CardHeader>
                    <Row justifyContent="space-between">
                    <CardTitle>Information</CardTitle>
                    <IconButton title="More options" variant="plain" size="sm">
                        <MoreHorizontal />
                    </IconButton>
                    </Row>
                </CardHeader>
                <CardContent>
                    <Stack spacing={2}>
                        <Stack spacing={1}>
                        <Input label="Name" placeholder="Enter your name..." />
                        <Input label="Email" placeholder="Enter your email..." />
                        </Stack>
                        <CardActions>
                            <Button>Save</Button>
                        </CardActions>
                    </Stack>
                </CardContent>
            </>
        )
    }
};

export const Empty: Story = {
    args: {
        className: 'aspect-square size-40 bg-card/60'
    }
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        className: 'aspect-square size-40 bg-card/60'
    }
};

export const Content: Story = {
    args: {
        children: (
            <CardContent>
                Content
            </CardContent>
        )
    }
};

export const ContentNoHeader: Story = {
    args: {
        children: (
            <CardContent noHeader>
                Content
            </CardContent>
        )
    }
};

export const Header: Story = {
    args: {
        children: (
            <>
                <CardHeader>
                    Header
                </CardHeader>
                <CardContent>
                    Content
                </CardContent>
            </>
        )
    }
};

export const Title: Story = {
    args: {
        children: (
            <>
                <CardHeader>
                    <CardTitle>Title</CardTitle>
                </CardHeader>
                <CardContent>
                    Content
                </CardContent>
            </>
        )
    }
};

export const Overflow: Story = {
    args: {
        children: (
            <CardOverflow>
                <div>Overflow</div>
            </CardOverflow>
        )
    }
};

export const Actions: Story = {
    args: {
        className: undefined,
        children: (
            <>
                <CardHeader>
                    <CardTitle>Title</CardTitle>
                </CardHeader>
                <CardContent>
                    <Stack spacing={1}>
                        <span>Content</span>
                        <CardActions>
                            <Button>Button</Button>
                        </CardActions>
                    </Stack>
                </CardContent>
            </>
        )
    }
};