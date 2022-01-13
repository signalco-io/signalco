import { Container } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Graph from "./Graph";

export default {
    title: 'Components/Graph',
    component: Graph,
    decorators: [
        Story => (
            <Container maxWidth='lg'>
                <Story />
            </Container>
        )
    ],
    args: {
        width: 400,
        height: 200
    }
} as ComponentMeta<typeof Graph>;

const Template: ComponentStory<typeof Graph> = (args) => <Graph {...args} />;

export const Empty = Template.bind({});

export const TimeLine = Template.bind({});
TimeLine.args = {
    data: [
        { id: '2022-01-13T10:35:00.0Z', value: 'true' },
        { id: '2022-01-13T11:35:00.0Z', value: 'false' },
        { id: '2022-01-13T12:55:00.0Z', value: 'true' },
    ],
    durationMs: 3 * 60 * 60 * 1000,
    label: 'Sample'
}

export const Area = Template.bind({});
Area.args = {
    data: [
        { id: '2022-01-13T10:35:00.0Z', value: '15.5' },
        { id: '2022-01-13T11:35:00.0Z', value: '18' },
        { id: '2022-01-13T12:55:00.0Z', value: '16.7' },
    ],
    durationMs: 3 * 60 * 60 * 1000
}
