import Image from 'next/image';

const TvVisual = (props: { state: boolean, theme: "dark" | "light", size: number }) => {
    return <Image src="/assets/visuals/tvVisual.svg" width={props.size} height={props.size} alt="TV" />;
}

export default TvVisual;