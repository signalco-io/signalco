import { ComponentMeta, ComponentStory } from '@storybook/react';
import DisableButton from './DisableButton';

export default {
    title: 'Components/Shared/Buttons/DisableButton',
    component: DisableButton,
    args: {
        disabled: false,
        readonly: false
    },
} as ComponentMeta<typeof DisableButton>;

function TemplatedComponent(args: any) {
    return <DisableButton {...args} />;
}
const Template: ComponentStory<typeof DisableButton> = TemplatedComponent;

export const Default = Template.bind({});
