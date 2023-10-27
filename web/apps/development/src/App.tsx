import './App.css'
import { AppItemSection } from './AppItemSection';
import { AppItemType } from './AppItemType';
import { Stack } from '@signalco/ui/dist/Stack';

const tools: AppItemType[] = [
    { label: 'UI Docs', href: 'http://localhost:6007' },
];

const apps: AppItemType[] = [
    { label: 'Web', href: 'http://localhost:3000' },
    { label: 'App', href: 'http://localhost:3001' },
    { label: 'Blog', href: 'http://localhost:3002' },
];

const uSaas: AppItemType[] = [
    { label: 'slco', href: 'http://localhost:4002' },
    { label: 'brandgrab', href: 'http://localhost:4001' },
    { label: 'DoProcess.app', href: 'http://localhost:4003' },
];

function App() {
    const sections = [
        { items: tools, title: 'Tools' },
        { items: apps, title: 'Apps' },
        { items: uSaas, title: 'uSaas' },
    ];

    return (
        <>
            <header>
                <h1>Developer Home</h1>
            </header>
            <main>
                <Stack spacing={2}>
                    {sections.map(section => <AppItemSection key={section.title} {...section} />)}
                </Stack>
            </main>
        </>
    )
}

export default App
