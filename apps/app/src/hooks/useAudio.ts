import { useEffect, useRef } from 'react';

export default function useAudio(src: string | undefined, { volume = 1, playbackRate = 1 }: any) {
    const audio = useRef(new Audio(src))

    useEffect(() => {
        audio.current.volume = volume
    }, [volume])

    useEffect(() => {
        audio.current.playbackRate = playbackRate
    }, [playbackRate])

    return audio.current
}
