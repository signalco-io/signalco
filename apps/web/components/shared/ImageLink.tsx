import Link from 'next/link';
import Image, { ImageProps } from 'next/image';
import MuiLink from '@mui/joy/Link';

export default function LinkImage(props: { href: string; imageProps: ImageProps; }) {
    return (
        <Link href={props.href} passHref legacyBehavior>
            <MuiLink>
                <Image {...props.imageProps} alt={props.imageProps.alt} />
            </MuiLink>
        </Link>
    );
}
