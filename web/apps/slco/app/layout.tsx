import { Metadata, Viewport } from 'next';
import './global.css';

export default function RootLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={'font-sans'}>
                {children}
            </body>
        </html>
    );
}

export const metadata = {
    title: 'slco',
    description: 'Short links',
    manifest: '/manifest.json',
    icons: {
        apple: '/apple-touch-icon.png',
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
        ]
    }
} satisfies Metadata;

export const viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
        { color: 'black' },
    ]
} satisfies Viewport;
