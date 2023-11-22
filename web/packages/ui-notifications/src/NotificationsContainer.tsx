import { Toaster } from 'sonner';

export function NotificationsContainer({ theme }: { theme?: 'light' | 'dark' }) {
    return <Toaster theme={theme} />
}
