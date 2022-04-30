import { CopyAll as CopyAllIcon } from '@mui/icons-material';
import { FilledInput, InputAdornment } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import IconButtonCopyToClipboard from './IconButtonCopyToClipboard';

export default {
    title: 'Components/Shared/Form/IconButtonCopyToClipboard',
    component: IconButtonCopyToClipboard,
    args: {
        id: 'id',
        title: 'title'
    }
} as ComponentMeta<typeof IconButtonCopyToClipboard>;

const Template: ComponentStory<typeof IconButtonCopyToClipboard> = (args) => <IconButtonCopyToClipboard {...args} />;
const InputTemplate: ComponentStory<typeof IconButtonCopyToClipboard> = (args) => (
    <FilledInput
        hiddenLabel
        defaultValue="Input text"
        endAdornment={
            <InputAdornment position="end">
                <IconButtonCopyToClipboard {...args}>
                    <CopyAllIcon />
                </IconButtonCopyToClipboard>
            </InputAdornment>
        } />
);

export const Default = Template.bind({});

export const Icon = Template.bind({});
Icon.args = {
    children: <CopyAllIcon />
}

export const Input = InputTemplate.bind({});
Input.args = {
    edge: true
}
