import useAudio from '../useAudio';

export default function useAudioOff() {
    return useAudio('/sounds/switch-off.mp3', { volume: 0.8 });
}
