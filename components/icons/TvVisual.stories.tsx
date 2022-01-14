import { ComponentMeta, ComponentStory } from "@storybook/react";
import TvVisual from "./TvVisual";

export default {
    title: 'Visuals/TvVisual',
    component: TvVisual
} as ComponentMeta<typeof TvVisual>;

const Template: ComponentStory<typeof TvVisual> = (args) => <TvVisual {...args} />;

export const Empty = Template.bind({});

export const State = Template.bind({});
State.args = {
    state: true
}
