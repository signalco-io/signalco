import Link from 'next/link';
import { Button } from '@mui/joy';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { ChildrenProps } from 'src/sharedTypes';

interface NavigatingButtonProps extends ChildrenProps {
    href: string;
    prefetch?: boolean;
}

export default function NavigatingButton(props: NavigatingButtonProps) {
    return (
        <Link href={props.href} passHref prefetch={props.prefetch ?? true}>
            <Button
                color="primary"
                variant="solid"
                endDecorator={<KeyboardArrowRightIcon fontSize="small" />}>
                {props.children}
            </Button>
        </Link>
    );
}
