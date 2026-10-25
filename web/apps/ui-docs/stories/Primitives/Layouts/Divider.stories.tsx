import { Divider } from '@signalco/ui-primitives/Divider';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    component: Divider,
    decorators: [
        (Story) => <div className="w-96 max-w-full"><Story /></div>,
    ],
    parameters: {
        docs: {
            description: {
                component: 'Pass children to show a label. Horizontal labels are centered by default; use text-left, text-center, or text-right to position them. Label typography is inherited and can be styled by the caller.',
            },
        },
    },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContent: Story = {
    args: { children: 'Racuni i korisnici' },
};

export const Alignments: Story = {
    args: { children: 'Racuni i korisnici' },
    render: (args) => (
        <div className="space-y-4">
            <Divider {...args} className="text-left" />
            <Divider {...args} className="text-center" />
            <Divider {...args} className="text-right" />
        </div>
    ),
};

export const CustomContent: Story = {
    args: {
        children: <span className="text-sm font-semibold uppercase tracking-widest">Custom label</span>,
    },
};

export const EmptyContent: Story = {
    args: { children: [null, false, ''] },
};

export const NumericContent: Story = {
    args: { children: 0 },
};

export const HorizontalFlex: Story = {
    args: { flex: true, children: 'Section' },
    render: (args) => (
        <div className="flex flex-col gap-4">
            <span>First section</span>
            <Divider {...args} />
            <span>Second section</span>
        </div>
    ),
};

export const Vertical: Story = {
    args: { orientation: 'vertical' },
    render: (args) => <div className="h-48"><Divider {...args} /></div>,
};

export const VerticalWithContent: Story = {
    ...Vertical,
    args: { orientation: 'vertical', children: 'or' },
};

export const VerticalFlex: Story = {
    args: { orientation: 'vertical', flex: true, children: 'or' },
    render: (args) => (
        <div className="flex h-48 items-center gap-4">
            <span>First section</span>
            <Divider {...args} />
            <span>Second section</span>
        </div>
    ),
};

export const VerticalFlexWithoutContent: Story = {
    ...VerticalFlex,
    args: { orientation: 'vertical', flex: true },
};
