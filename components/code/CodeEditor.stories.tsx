import { Box } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import CodeEditor from './CodeEditor';

export default {
    title: 'Components/Code/CodeEditor',
    component: CodeEditor,
    args: {
        height: 150,
        code: '# View Signalco Station logs\nsudo journalctl -u signalcostation.service -f\n\n# View Zigbee2MQTT logs\nsudo journalctl -u zigbee2mqtt.service -f',
        language: 'bash'
    }
} as ComponentMeta<typeof CodeEditor>;

const Template: ComponentStory<typeof CodeEditor> = (args) => <Box sx={{ m: 2 }}><CodeEditor {...args} /></Box>;

export const Default = Template.bind({});

export const Readonly = Template.bind({});
Readonly.args = {
    readonly: true
};

export const Json = Template.bind({});
Json.args = {
    language: 'json',
    height: 400,
    code: '{\n    "type": 0,\n    "entityId": "",    \n    "userEmails": [\n        ""\n    ]\n}'
};

export const LineNumbers = Template.bind({});
LineNumbers.args = {
    lineNumbers: true
};
