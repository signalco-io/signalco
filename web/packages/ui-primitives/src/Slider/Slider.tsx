import { ComponentProps, PropsWithChildren, useId, useMemo } from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { Stack } from '../Stack';
import { cx } from '../cx'

export type SliderProps = ComponentProps<typeof SliderPrimitive.Root> & {
    label?: string;
};

export function Slider({ id, name, className, label, ...props }: SliderProps) {
        const customId = useId();
        const labelId = label ? `label-${id ?? name ?? customId}` : undefined;
    const VerticalContainer = useMemo(() => label
        ? (props: PropsWithChildren) => <Stack spacing={0.5} {...props} />
        : (props: PropsWithChildren) => <>{props.children}</>
    , [label]);

    return (
        <VerticalContainer>
            {label && <label className="text-sm font-medium" id={labelId}>{label}</label>}
            <SliderPrimitive.Root
                id={id ?? name ?? customId}
                name={name}
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
        </VerticalContainer>
    )
}
