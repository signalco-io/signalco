import { ComponentMeta, ComponentStory } from '@storybook/react';
import DisplayEntityTarget from './DisplayEntityTarget';

export default {
    title: 'Components/Shared/Entity/DisplayDeviceTarget',
    component: DisplayEntityTarget,
} as ComponentMeta<typeof DisplayEntityTarget>;

const Template: ComponentStory<typeof DisplayEntityTarget> = (args) => <DisplayEntityTarget {...args} />;

export const Default = Template.bind({});

export const Loading = Template.bind({});
Loading.args = {
    //isLoading: true
};

export const Unknown = Template.bind({});
Unknown.args = {
    target: {
        entityId: 'unknown-device-id'
    }
};
