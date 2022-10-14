import { ComponentMeta, ComponentStory } from '@storybook/react';
import LocationMapPicker, { LocationMapPickerProps } from './LocationMapPicker';

export default {
    title: 'Components/Shared/Form/LocationMapPicker',
    component: LocationMapPicker,
    args: {
        onChange: () => {}
    }
} as ComponentMeta<typeof LocationMapPicker>;

function TemplatedComponent(args: LocationMapPickerProps) {
    return <LocationMapPicker {...args} />;
}
const Template: ComponentStory<typeof LocationMapPicker> = TemplatedComponent;

export const Default = Template.bind({});
