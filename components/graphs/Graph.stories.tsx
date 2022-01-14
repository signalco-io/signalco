import { ComponentMeta, ComponentStory } from "@storybook/react";
import Graph from "./Graph";

export default {
    title: 'Components/Graph',
    component: Graph,
    args: {
        width: 400,
        height: 200
    }
} as ComponentMeta<typeof Graph>;

const Template: ComponentStory<typeof Graph> = (args) => <Graph {...args} />;

const now = new Date(2022, 2, 22, 22, 22, 22);
const t1 = new Date(now.getTime());
t1.setTime(now.getTime() - 15 * 60 * 1000);
const t2 = new Date(now.getTime());
t2.setTime(now.getTime() - 60 * 60 * 1000);
const t3 = new Date(now.getTime());
t3.setTime(now.getTime() - 170 * 60 * 1000);

export const Empty = Template.bind({});

export const TimeLine = Template.bind({});
TimeLine.args = {
    data: [
        { id: t1.toISOString(), value: 'true' },
        { id: t2.toISOString(), value: 'false' },
        { id: t3.toISOString(), value: 'true' },
    ],
    durationMs: 3 * 60 * 60 * 1000,
    label: 'Sample',
    startDateTime: now
}

export const Area = Template.bind({});
Area.args = {
    data: [
        { id: t1.toISOString(), value: '15.5' },
        { id: t2.toISOString(), value: '18' },
        { id: t3.toISOString(), value: '16.7' },
    ],
    durationMs: 3 * 60 * 60 * 1000,
    startDateTime: now
}
