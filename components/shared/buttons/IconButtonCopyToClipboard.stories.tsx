/* eslint-disable react/function-component-definition */
import { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TextField } from '@mui/joy';
import { LinkOff } from '@mui/icons-material';
import IconButtonCopyToClipboard from './IconButtonCopyToClipboard';

export default {
    title: 'Components/Shared/Buttons/IconButtonCopyToClipboard',
    component: IconButtonCopyToClipboard
} as ComponentMeta<typeof IconButtonCopyToClipboard>;

const Template: ComponentStory<typeof IconButtonCopyToClipboard> = (args) => <IconButtonCopyToClipboard {...args} />;
const InputTemplate: ComponentStory<typeof IconButtonCopyToClipboard> = (args) => {
    const [text, setText] = useState('Default text');

    return (
        <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            endDecorator={(
                <IconButtonCopyToClipboard {...args} value={text} />
            )} />
    );
};

export const Default = Template.bind({});

export const Icon = Template.bind({});
Icon.args = {
    children: <LinkOff />
}

export const Input = InputTemplate.bind({});
