import { useAudio } from '@signalco/hooks/dist/useAudio';

export default function useAudioOff() {
    return useAudio('/sounds/switch-off.mp3', { volume: 0.8 });
}
