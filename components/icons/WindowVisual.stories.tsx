import { ComponentMeta, ComponentStory } from '@storybook/react';
import WindowVisual from './WindowVisual';

export default {
    title: 'Visuals/WindowVisual',
    component: WindowVisual,
    args: {
        dateAndTime: new Date(2022, 2, 22, 12, 22, 22)
    }
} as ComponentMeta<typeof WindowVisual>;

const Template: ComponentStory<typeof WindowVisual> = (args) => <WindowVisual {...args} />;

export const Empty = Template.bind({});

export const ShadePercentage = Template.bind({});
ShadePercentage.args = {
    shadePerc: 0.3
}
