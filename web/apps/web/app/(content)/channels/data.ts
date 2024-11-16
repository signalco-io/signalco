import { KnownPages } from '../../../src/knownPages';

export const channelsFaq = [
    {
        component: 'Faq1',
        header: 'FAQ',
        description: 'Find answers to common questions about signalco channels.',
        ctas: [
            { label: 'Contact', href: KnownPages.Contact },
        ],
        features: [
            { id: 'channel', header: 'What is Channel?', description: 'Channel is Entity that contains all information required for connected online service, application or device. Channels can execute actions directly or contain connected entities to manage.' },
            { id: 'entities', header: 'What are Entities?', description: 'Entity is a thing you want to automate in signalco. This can be is online service connected to signalco, smart device, your custom space, automation process, etc.' },
            { id: 'executions', header: 'What are Executions?', description: 'Execution is when one of your automation processes executes one action (e.g.: when automation sends an email when new subscribes is added to a list).' },
        ]
    }
];