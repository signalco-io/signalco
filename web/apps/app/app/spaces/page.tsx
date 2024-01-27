import dynamic from 'next/dynamic'

const Dashboards = dynamic(() => import('../../components/dashboards/Dashboards').then(mod => mod.Dashboards), { ssr: false });

export default function SpacesPage() {
    return (
        <Dashboards />
    );
}
