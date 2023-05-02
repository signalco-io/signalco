import Image, { ImageProps } from 'next/image';
import {Link} from '../Link';

export type ImageLinkProps = {
    href: string;
    imageProps: ImageProps;
}

export function ImageLink({ href, imageProps }: ImageLinkProps) {
    return (
        <Link href={href}>
            <Image {...imageProps} alt={imageProps.alt} />
        </Link>
    );
}
