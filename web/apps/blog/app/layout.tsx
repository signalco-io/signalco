import { Metadata } from 'next';
import '@signalco/ui/dist/index.css';
import { PageLayout } from '../components/layouts/PageLayout';
import './global.scss';

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <PageLayout>{children}</PageLayout>
            </body>
        </html>
    );
}

export const metadata = {
    title: 'Signalco | Blog',
    description: 'Automate your life',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
        { color: 'black' },
    ],
    icons: {
        apple: '/apple-touch-icon.png',
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'}
        ]
    }
} satisfies Metadata;
