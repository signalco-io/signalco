import { ComponentMeta, ComponentStory } from '@storybook/react';
import EntityDetailsView, { EntityDetailsViewProps } from './EntityDetailsView';

export default {
    title: 'Components/Views/EntityDetails',
    component: EntityDetailsView,
    args:{
        id: ''
    }
} as ComponentMeta<typeof EntityDetailsView>;

function EntityDetailsViewTemplate(args: EntityDetailsViewProps) { return <EntityDetailsView {...args} />; }
const Template: ComponentStory<typeof EntityDetailsView> = EntityDetailsViewTemplate;

export const Default = Template.bind({});
