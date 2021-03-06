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

// Screenshot
const screenshotSkipParams = {
    screenshot: {
        skip: true
    }
}
const screenshotParams = {
    layout: 'centered',
    screenshot: {
        viewport: { width: 362, height: 370 }
    }
}
// TODO: Uncomment when needed, this is for widgets larger than 4x4
// const screenshotParamsMax = {
//     ...screenshotParams,
//     screenshot: {
//         viewport: { width: 702, height: 702 }
//     }
// }

const Template: ComponentStory<typeof Widget> = (args) => <Widget {...args} />;

export const Empty = Template.bind({});
Empty.parameters = process.env.WIDGET_IMAGES ? screenshotSkipParams : screenshotParams;

export const EditMode = Template.bind({});
EditMode.args = {
    isEditMode: true,
};
EditMode.parameters = process.env.WIDGET_IMAGES ? screenshotSkipParams : screenshotParams;

export const WidgetState = Template.bind({});
WidgetState.args = {
    type: 'state',
    config: {
        label: 'Label',
        target: [{ deviceId: 'id', channelName: 'channel', contactName: 'name' }],
        visual: 'lightbulb'
    }
};
WidgetState.parameters = screenshotParams;

export const WidgetIdicator = Template.bind({});
WidgetIdicator.args = {
    type: 'indicator',
    config: {
        target: { deviceId: 'id', channelName: 'channel', contactName: 'name' },
        columns: 1
    }
};
WidgetIdicator.parameters = screenshotParams;

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
WidgetShades.parameters = screenshotParams;

export const WidgetVacuum = Template.bind({});
WidgetVacuum.args = {
    type: 'vacuum',
    config: {
        label: 'Label',
        columns: 4,
        rows: 4
    }
};
WidgetVacuum.parameters = screenshotParams;

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
WidgetTermostat.parameters = screenshotParams;

export const WidgetTime = Template.bind({});
WidgetTime.args = {
    type: 'time',
    config: {
        columns: 2,
        rows: 1
    }
};
WidgetTime.parameters = screenshotParams;

export const WidgetChecklist = Template.bind({});
WidgetChecklist.args = {
    type: 'checklist',
    config: {
        label: 'Checklist widget',
        columns: 4,
        rows: 4
    }
};
WidgetChecklist.parameters = screenshotParams;

export const WidgetButton = Template.bind({});
WidgetButton.args = {
    type: 'button',
    config: {
        columns: 1,
        rows: 1
    }
};
WidgetButton.parameters = screenshotParams;
