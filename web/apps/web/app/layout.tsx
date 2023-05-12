import Script from 'next/script';
import { type Metadata } from 'next';
import './global.css';

export default function RootLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                {children}
                <Script src="/clarity.js" />
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
    manifest: '/manifest.webmanifest',
    icons: {
        apple: '/apple-touch-icon.png',
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
        ]
    }
} satisfies Metadata;
