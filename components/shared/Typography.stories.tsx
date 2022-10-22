import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Typography, TypographyProps } from '@mui/joy';

export default {
    title: 'Views/Entity/EntityDetails',
    component: Typography
} as ComponentMeta<typeof Typography>;

function EntityDetailsViewTemplate(args: TypographyProps) { return <Typography {...args} />; }
const Template: ComponentStory<typeof Typography> = EntityDetailsViewTemplate;

export const Default = Template.bind({});
Default.args = { children: 'Default' };
