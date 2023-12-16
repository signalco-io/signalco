import { Card } from "@signalco/ui-primitives/Card";
import { GentleSlide } from "@signalco/ui/GentleSlide";
import { Stack } from "@signalco/ui-primitives/Stack";
import { Row } from "@signalco/ui-primitives/Row";
import { StoryObj } from "@storybook/react";

export default { component: GentleSlide, tags: ['autodocs'] };
type Story = StoryObj<typeof GentleSlide>;

const Template: Story = {
    render: (props) => {
        return (
            <Card>
                <Stack>
                    <Row spacing={1}>
                        {new Array(3).fill(0).map((_, i) => (
                            <GentleSlide 
                            index={i} 
                            direction={props.direction} 
                            appear={props.appear} 
                            duration={props.duration} 
                            collapsedWhenHidden={props.collapsedWhenHidden}
                            appearDelayPerIndex={props.appearDelayPerIndex}
                            amount={props.amount}>
                                <div style={{ width: 50, height: 50, backgroundColor: 'gray' }}>{i}</div>
                            </GentleSlide>
                        ))}
                    </Row>
                    <p>Quis et quis ex incididunt voluptate officia.</p>
                </Stack>
            </Card>
        );
    },
    args: {
        appear: true,
        duration: 500,
        collapsedWhenHidden: false,
        direction: 'left',
        amount: 100,
        appearDelayPerIndex: 100
    }
};

export const Default: Story = { ...Template };