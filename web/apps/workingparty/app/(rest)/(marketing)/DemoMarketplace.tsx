import { marketplaceWorkers } from '../../../src/data/markerplaceWorkers';
import { DemoMarketplaceWorkerCard } from './DemoMarketplaceWorkerCard';

export function DemoMarketplace() {
    const workers = marketplaceWorkers.slice(0, 20);
    return (
        <div className="group relative inline-flex h-64 w-full flex-col flex-nowrap overflow-hidden">
            <div className="flex animate-scroll flex-col justify-center [animation-duration:120s] group-hover:[animation-play-state:paused]">
                {workers.map((worker) => (
                    <DemoMarketplaceWorkerCard key={worker.id} worker={worker} />
                ))}
            </div>
            <div aria-hidden={true} className="flex animate-scroll flex-col justify-center [animation-duration:120s] group-hover:[animation-play-state:paused]">
                {workers.map((worker) => (
                    <DemoMarketplaceWorkerCard key={worker.id} worker={worker} />
                ))}
            </div>
            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-background to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent"></div>
        </div>
    );
}
