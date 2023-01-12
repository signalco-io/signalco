import useAudio from '../useAudio';

export default function useAudioOn() {
    return useAudio('/sounds/switch-on.mp3', { volume: 0.8 });
}
