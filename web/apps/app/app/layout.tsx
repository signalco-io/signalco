import '../styles/global.scss';
import '@signalco/ui/dist/index.css';
import 'react-toastify/dist/ReactToastify.css';
import { PropsWithChildren } from 'react';
import { type Metadata } from 'next';
import { AppLayout } from '../components/layouts/AppLayout';
import { LayoutClientWrapper } from './LayoutClientWrapper';

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <body>
                <LayoutClientWrapper>
                    <AppLayout>
                        {children}
                    </AppLayout>
                </LayoutClientWrapper>
            </body>
        </html>
    );
}

export const metadata = {
    title: 'Signalco',
    description: 'Automate your life',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
        { color: 'black' },
    ],
    manifest: '/manifest.json',
    icons: {
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
        ]
    }
} satisfies Metadata;
