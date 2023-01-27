import { useEffect, useRef } from 'react';

export type UseAudioOptions = {
    volume?: number | undefined;
    playbackRate?: number | undefined;
};

export default function useAudio(src: string, { volume = 1, playbackRate = 1 }: UseAudioOptions) {
    const audio = useRef(new Audio(src))

    useEffect(() => {
        audio.current.volume = volume
    }, [volume])

    useEffect(() => {
        audio.current.playbackRate = playbackRate
    }, [playbackRate])

    return audio.current
}
