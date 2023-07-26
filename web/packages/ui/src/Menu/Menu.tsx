import { Popper, PopperProps } from '../Popper';

export type MenuProps = PopperProps;

export function Menu({ ...rest }: MenuProps) {
    return (
        <Popper {...rest} />
    );
}
