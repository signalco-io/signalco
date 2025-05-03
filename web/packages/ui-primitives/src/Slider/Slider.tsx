import { ComponentProps } from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cx } from '@signalco/ui-primitives/cx'

export type SliderProps = ComponentProps<typeof SliderPrimitive.Root>;

export function Slider({ className, ...props }: SliderProps) {
    return (
        <SliderPrimitive.Root
            className={cx(
                'relative flex w-full touch-none select-none items-center',
                className
            )}
            {...props}
        >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
                <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="block size-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        </SliderPrimitive.Root>
    )
}
