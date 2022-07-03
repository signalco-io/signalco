import { ComponentMeta, ComponentStory } from '@storybook/react';
import QuickAppThemePicker from './QuickAppThemePicker';

export default {
    title: 'Components/Settings/QuickAppThemePicker',
    component: QuickAppThemePicker
} as ComponentMeta<typeof QuickAppThemePicker>;

const Template: ComponentStory<typeof QuickAppThemePicker> = () => <QuickAppThemePicker />;

export const Empty = Template.bind({});
