import Image, { ImageProps } from 'next/image';
import Link from '../Link';

/** @alpha */
export interface ImageLinkProps {
    href: string;
    imageProps: ImageProps;
}

/** @alpha */
export default function ImageLink({ href, imageProps }: ImageLinkProps) {
    return (
        <Link href={href}>
            <Image {...imageProps} alt={imageProps.alt} />
        </Link>
    );
}
