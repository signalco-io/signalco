import { List } from "@signalco/ui-primitives/List";
import { ListItem } from "@signalco/ui-primitives/ListItem";
import { ListTreeItem } from "@signalco/ui-primitives/ListTreeItem";
import { StoryObj } from "@storybook/react";
import { FileInput } from "@signalco/ui-icons";

export default {
    component: List,
    tags: ['autodocs']
};
type Story = StoryObj<typeof List>;

export const Default: Story = {
    args: {
        children: (
            <>
                <ListItem label="Item 1" />
                <ListItem label="Item 2" />
                <ListItem label="Item 3" />
            </>
        )
    }
};

export const WithLinkItems: Story = {
    args: {
        children: (
            <>
                <ListItem label="Item 1" href="#1" variant="outlined" />
                <ListItem label="Item 2" href="#2" variant="outlined" />
                <ListItem label="Item 3" href="#3" variant="outlined" />
            </>
        ),
        variant: 'outlined'
    }
};

export const WithTreeItems: Story = {
    args: {
        children: (
            <>
                <ListTreeItem label="Item 1 (no children)" href='#1' startDecorator={<FileInput className="size-5" />} />
                <ListTreeItem label="Item 2" startDecorator={<FileInput className="size-5" />}>
                    <ListTreeItem label="Item 2.1" href='#2.1' />
                    <ListTreeItem label="Item 2.2" href='#2.2' />
                    <ListTreeItem label="Item 2.3" href='#2.3' />
                </ListTreeItem>
                <ListTreeItem label="Item 3" startDecorator={<FileInput className="size-5" />}>
                    <ListTreeItem label="Item 3.1" startDecorator={<FileInput className="size-5" />}>
                        <ListTreeItem label="Item 3.1.1" href='#3.1.1' startDecorator={<FileInput className="size-5" />} />
                        <ListTreeItem label="Item 3.1.2" href="#3.1.2" startDecorator={<FileInput className="size-5" />} />
                        <ListTreeItem label="Item 3.1.3" href='#3.1.3' startDecorator={<FileInput className="size-5" />} />
                    </ListTreeItem>
                    <ListTreeItem label="Item 3.2" href='#3.2' startDecorator={<FileInput className="size-5" />} />
                    <ListTreeItem label="Item 3.3" href='#3.3' startDecorator={<FileInput className="size-5" />} />
                </ListTreeItem>
            </>
        ),
        variant: 'outlined'
    }
};

export const WithSidebarTreeItems: Story = {
    args: {
        children: (
            <>
                <ListTreeItem label="Item 1 (no children)" side="end" />
                <ListTreeItem label="Item 2" side="end">
                    <ListTreeItem label="Item 2.1" side="end" />
                    <ListTreeItem label="Item 2.2" side="end" />
                </ListTreeItem>
                <ListTreeItem label="Item 3" side="end">
                    <ListTreeItem label="Item 3.2" side="end" />
                    <ListTreeItem label="Item 3.3" side="end" />
                </ListTreeItem>
            </>
        ),
        variant: 'outlined'
    }
};