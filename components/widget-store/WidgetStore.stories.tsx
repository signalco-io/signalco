import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import WidgetStore from './WidgetStore';
import Widget from '../widgets/Widget';

export default {
    title: 'Components/Store/Widgets',
    component: WidgetStore,
} as ComponentMeta<typeof WidgetStore>;

const Template: ComponentStory<typeof Widget> = (args) => <WidgetStore onAddWidget={() => { }} {...args} />;

export const Store = Template.bind({});
