import { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import CopyToClipboardInput from './CopyToClipboardInput';

export default {
    title: 'Components/Shared/Form/CopyToClipboardInput',
    component: CopyToClipboardInput,
    args: {
        id: 'id'
    }
} as ComponentMeta<typeof CopyToClipboardInput>;

const Template: ComponentStory<typeof CopyToClipboardInput> = (args) => {
    const [value, setValue] = useState('');
    return (
        <CopyToClipboardInput value={value} onChange={(e) => setValue(e.target.value)} {...args} />
    );
};

export const Default = Template.bind({});
