import { ComponentMeta, ComponentStory } from '@storybook/react';
import AppThemePicker from './AppThemePicker';

export default {
    title: 'Components/Settings/AppThemePicker',
    component: AppThemePicker
} as ComponentMeta<typeof AppThemePicker>;

const Template: ComponentStory<typeof AppThemePicker> = () => <AppThemePicker />;

export const Empty = Template.bind({});
