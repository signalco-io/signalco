import { ScrollArea } from "@signalco/ui-primitives/ScrollArea";
import { Meta, StoryObj } from "@storybook/react";

export default {
    component: ScrollArea,
    tags: ['autodocs'],
    args: {
        className: 'h-64 w-64 p-4 rounded-md border bg-card',
        children: 'Culpa fugiat eiusmod reprehenderit officia laborum ex incididunt voluptate dolor. Occaecat dolor ut do elit non nulla ad esse aliqua. Nostrud sint ipsum nisi non anim ut. Consequat aute dolor adipisicing nostrud amet commodo eu ipsum nulla id duis cillum aliqua id. Nulla enim exercitation in deserunt aliqua fugiat sint et non qui.In ipsum esse dolor eu in occaecat exercitation nulla proident nulla ex mollit excepteur.Tempor irure culpa eu excepteur consectetur est mollit consequat veniam nostrud fugiat nostrud.Consectetur Lorem elit commodo non sunt non dolore aute aute exercitation do proident exercitation.'
    }
} satisfies Meta<typeof ScrollArea>;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = { };
