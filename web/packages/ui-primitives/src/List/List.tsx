import { Stack, StackProps } from '../Stack';

export type ListProps = StackProps;

export function List({ ...rest }: ListProps) {
    return (
        <Stack {...rest} />
    );
}
