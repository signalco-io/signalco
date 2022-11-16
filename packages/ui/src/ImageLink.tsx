import Image, { ImageProps } from 'next/image';
import Link from './Link';

interface LinkImageProps {
    href: string;
    imageProps: ImageProps;
}

export default function LinkImage({ href, imageProps }: LinkImageProps) {
    return (
        <Link href={href}>
            <Image {...imageProps} alt={imageProps.alt} />
        </Link>
    );
}
