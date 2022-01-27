import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Widget from './Widget';
import WidgetStore from './WidgetStore';

export default {
    title: 'Components/Widgets/Store',
    component: WidgetStore,
} as ComponentMeta<typeof WidgetStore>;

const Template: ComponentStory<typeof Widget> = (args) => <WidgetStore onAddWidget={() => { }} {...args} />;

export const Store = Template.bind({});
