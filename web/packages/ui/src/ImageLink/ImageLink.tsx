import Image, { ImageProps } from 'next/image';
import { Link } from '../Link';
import type { AnchorHTMLAttributes } from 'react';
import { cx } from 'classix';

export type ImageLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    imageProps: ImageProps;
    href: string;
}

export function ImageLink({ href, className, imageProps }: ImageLinkProps) {
    return (
        <Link
            className={cx('hover:opacity-75 transition-opacity duration-200', className)}
            href={href}>
            <Image {...imageProps} alt={imageProps.alt} />
        </Link>
    );
}
