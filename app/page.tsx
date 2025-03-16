import { Header } from '@/components/header';
import { Features } from '@/components/features';
import { HeroSection } from '@/components/hero-section';
import { AnimatedFooter } from '@/components/animated-footer';

export default function Home() {
    return (
        <main className='min-h-screen flex flex-col'>
            <Header />
            <HeroSection />
            <Features />
            <div className="flex-grow"></div>
            <AnimatedFooter />
        </main>
    );
}
