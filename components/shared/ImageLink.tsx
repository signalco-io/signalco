import Link from "next/link";
import MuiLink from '@mui/material/Link';
import Image, { ImageProps } from 'next/image';

export default function LinkImage(props: { href: string; imageProps: ImageProps; }) {
    return (
        <Link href={props.href} passHref>
            <MuiLink>
                <Image alt={props.imageProps.alt} {...props.imageProps} />
            </MuiLink>
        </Link>
    );
}