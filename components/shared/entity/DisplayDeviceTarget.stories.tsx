import { ComponentMeta, ComponentStory } from '@storybook/react';
import DisplayDeviceTarget from './DisplayDeviceTarget';

export default {
    title: 'Components/Shared/Entity/DisplayDeviceTarget',
    component: DisplayDeviceTarget,
} as ComponentMeta<typeof DisplayDeviceTarget>;

const Template: ComponentStory<typeof DisplayDeviceTarget> = (args) => <DisplayDeviceTarget {...args} />;

export const Default = Template.bind({});

export const Loading = Template.bind({});
Loading.args = {
    isLoading: true
};

export const Unknown = Template.bind({});
Unknown.args = {
    target: {
        deviceId: 'unknown-device-id'
    }
};
