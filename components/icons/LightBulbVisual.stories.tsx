import { ComponentMeta, ComponentStory } from "@storybook/react";
import LightBulbVisual from "./LightBulbVisual";

export default {
    title: 'Visuals/LightBulbVisual',
    component: LightBulbVisual
} as ComponentMeta<typeof LightBulbVisual>;

const Template: ComponentStory<typeof LightBulbVisual> = (args) => <LightBulbVisual {...args} />;

export const Empty = Template.bind({});

export const State = Template.bind({});
State.args = {
    state: true
}
