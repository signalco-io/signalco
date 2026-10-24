import { Meta, StoryObj } from "@storybook/nextjs";
import * as Icons from "@signalco/ui-icons"

const meta: Meta = {
    tags: ['autodocs']
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
    render: () => {
        return (
            <div className="grid grid-cols-10 gap-4">
                {Object.entries(Icons).map(([name, Icon]) => {
                    const Component = Icon as React.FC<React.SVGProps<SVGSVGElement>>;
                    return (
                        <div key={name} className="flex flex-col items-center justify-center gap-2">
                            <Component className="h-8 w-8" />
                            <span className="text-xs">{name}</span>
                        </div>
                    );
                }
                )}
            </div>
        );
    }
};
