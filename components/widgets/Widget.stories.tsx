import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Widget from './Widget';

export default {
    title: 'Components/Widgets/Widget',
    component: Widget,
    args: {
        isEditMode: false,
        onRemove: () => { },
        setConfig: () => { }
    }
} as ComponentMeta<typeof Widget>;

const Template: ComponentStory<typeof Widget> = (args) => <Widget {...args} />;

export const Empty = Template.bind({});

export const EditMode = Template.bind({});
EditMode.args = {
    isEditMode: true,
};

export const WidgetState = Template.bind({});
WidgetState.args = {
    type: 'state',
    config: {
        label: 'Label',
        target: [{ deviceId: 'id', channelName: 'channel', contactName: 'name' }],
        visual: 'lightbulb'
    }
};

export const WidgetIdicator = Template.bind({});
WidgetIdicator.args = {
    type: 'indicator',
    config: {
        target: { deviceId: 'id', channelName: 'channel', contactName: 'name' },
        columns: 1
    }
};

export const WidgetShades = Template.bind({});
WidgetShades.args = {
    type: 'shades',
    config: {
        label: 'Label',
        target: { deviceId: 'id' },
        targetContactUp: { deviceId: 'id', channelName: 'channel', contactName: 'name' },
        targetContactDown: { deviceId: 'id', channelName: 'channel', contactName: 'name' },
        columns: 4
    }
};

export const WidgetVacuum = Template.bind({});
WidgetVacuum.args = {
    type: 'vacuum',
    config: {
        label: 'Label',
        columns: 4,
        rows: 4
    }
};

export const WidgetTermostat = Template.bind({});
WidgetTermostat.args = {
    type: 'termostat',
    config: {
        label: 'Label',
        targetTemperature: { deviceId: 'id', channelName: 'channel', contactName: 'name' },
        targetHeating: { deviceId: 'id', channelName: 'channel', contactName: 'name' },
        targetCooling: { deviceId: 'id', channelName: 'channel', contactName: 'name' },
        columns: 4,
        rows: 4
    }
};
