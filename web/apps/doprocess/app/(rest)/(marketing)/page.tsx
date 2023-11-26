import { ListTodo, Play, Share } from '@signalco/ui-icons';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { KnownPages } from '../../../src/knownPages';
import Footer from '../../../components/pages/Footer';
import { ImagePlaceholder } from '../../../components/images/ImagePlaceholder';

function FeaturesSection() {
    return (
        <section className="w-full py-2 sm:py-8 md:py-12 lg:py-24 xl:py-32">
            <div className="container mx-auto px-2 sm:px-4 md:px-6">
                <div className="mb-5 text-center md:mb-10 lg:mb-20">
                    <h1
                        id="explore"
                        className="pt-5 text-3xl font-bold tracking-tighter sm:text-4xl md:pt-10 md:text-5xl lg:pt-20">
                        Explore
                    </h1>
                    <p className="mx-auto mt-4 max-w-[700px] text-zinc-500 dark:text-zinc-400 md:text-lg">
                        Explore our features and start your journey with us.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-3 md:gap-12">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <ListTodo className="opacity-60" />
                        <h2 className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl">Document</h2>
                        <p className="mx-auto max-w-[700px] text-zinc-500 dark:text-zinc-400 md:text-lg">
                            Create and manage your documents in one place.
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <Play className="opacity-60" />
                        <h2 className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl">Run</h2>
                        <p className="mx-auto max-w-[700px] text-zinc-500 dark:text-zinc-400 md:text-lg">
                            Execute your tasks efficiently and effectively.
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <Share className="opacity-60" />
                        <h2 className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl">Share</h2>
                        <p className="mx-auto max-w-[700px] text-zinc-500 dark:text-zinc-400 md:text-lg">
                            Share your work with others and collaborate.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CoverSection() {
    return (
        <section className="w-full py-2 sm:py-8 md:py-12 lg:py-24 xl:py-32">
            <div className="container mx-auto px-2 sm:px-4 md:px-6">
                <div className="grid grid-cols-1 items-center gap-4 sm:gap-6 md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_550px] lg:gap-12">
                    <div className="mx-auto aspect-video w-full overflow-hidden rounded-xl object-cover object-center lg:order-first lg:w-auto">
                        <ImagePlaceholder width="" height="" />
                    </div>
                    <div className="flex flex-col justify-center space-y-2 sm:space-y-4">
                        <span className="flex items-end justify-center gap-2 sm:justify-start">
                            <h2 className="inline text-center text-2xl font-bold tracking-tighter sm:text-left md:text-3xl lg:text-4xl xl:text-5xl">
                                do process
                            </h2>
                            <p className="inline max-w-[600px] text-center text-lg text-zinc-500 dark:text-zinc-400 sm:text-left md:text-lg lg:text-xl/relaxed">
                                the right way.
                            </p>
                        </span>
                        <p className="max-w-[600px] text-center text-sm text-zinc-500 dark:text-zinc-400 sm:text-left sm:text-base md:text-lg lg:text-xl/relaxed">
                            Simplest and fastest way to document and act upon your processes.
                        </p>
                        <NavigatingButton href={KnownPages.Processes} className="w-full">
                            Start Now
                        </NavigatingButton>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function LandingPage() {
    return (
        <main>
            <CoverSection />
            <FeaturesSection />
            <Footer />
        </main>
    );
}
