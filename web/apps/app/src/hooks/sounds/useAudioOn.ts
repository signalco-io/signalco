import { useAudio } from '@signalco/hooks/useAudio';

export default function useAudioOn() {
    return useAudio('/sounds/switch-on.mp3', { volume: 0.8 });
}
