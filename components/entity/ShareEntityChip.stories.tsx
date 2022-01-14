import { ComponentMeta, ComponentStory } from "@storybook/react";
import ShareEntityChip from "./ShareEntityChip";

export default {
    title: 'Components/ShareEntityChip',
    component: ShareEntityChip,
    args: {
        entityType: 1
    }
} as ComponentMeta<typeof ShareEntityChip>;

const Template: ComponentStory<typeof ShareEntityChip> = (args) => <ShareEntityChip {...args} />;

export const Empty = Template.bind({});

export const Shared = Template.bind({});
Shared.args = {
    entityType: 2,
    entity: {
        id: "id",
        sharedWith: [
            { id: 'user1', email: "user1@example.com" },
            { id: 'user2', email: "user2@example.com" },
            { id: 'user3', email: "user3@example.com" }
        ]
    }
}

export const NoAction = Template.bind({});
NoAction.args = {
    ...Shared.args,
    disableAction: true
}
