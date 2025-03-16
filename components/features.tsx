'use client';
import { Shield, Key, RefreshCw, Lock } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function Features() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const features = [
        {
            icon: <Lock className='h-6 w-6 text-primary' />,
            title: 'Secure Vault',
            description:
                'Store all your passwords in an encrypted vault that only you can access.',
        },
        {
            icon: <Key className='h-6 w-6 text-primary' />,
            title: 'Password Generator',
            description:
                'Create strong, unique passwords with our advanced generator tool.',
        },
        {
            icon: <Shield className='h-6 w-6 text-primary' />,
            title: 'End-to-End Encryption',
            description:
                'Your data is encrypted before it leaves your device for maximum security.',
        },
        {
            icon: <RefreshCw className='h-6 w-6 text-primary' />,
            title: 'Cross-Device Sync',
            description:
                'Access your passwords from any device with secure synchronization.',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    return (
        <section className='w-full py-12 md:py-24 lg:py-32 bg-muted/50 overflow-hidden relative'>
            {/* Animated background patterns */}
            <div className='absolute inset-0 overflow-hidden opacity-30'>
                <svg
                    className='absolute w-full h-full'
                    xmlns='http://www.w3.org/2000/svg'>
                    <defs>
                        <pattern
                            id='smallGrid'
                            width='20'
                            height='20'
                            patternUnits='userSpaceOnUse'>
                            <path
                                d='M 20 0 L 0 0 0 20'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='0.5'
                                className='text-primary/30'
                            />
                        </pattern>
                    </defs>
                    <rect
                        width='100%'
                        height='100%'
                        fill='url(#smallGrid)'
                    />
                </svg>
            </div>

            <div
                className='px-4 container mx-auto relative z-10'
                ref={ref}>
                <motion.div
                    className='flex flex-col items-center justify-center space-y-4 text-center'
                    initial={{ opacity: 0, y: 50 }}
                    animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                    }
                    transition={{ duration: 0.8 }}>
                    <div className='space-y-2'>
                        <motion.div
                            className='inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm'
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={
                                isInView
                                    ? { opacity: 1, scale: 1 }
                                    : { opacity: 0, scale: 0.8 }
                            }
                            transition={{ duration: 0.5, delay: 0.2 }}>
                            Features
                        </motion.div>
                        <motion.h2
                            className='text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600'
                            initial={{ opacity: 0, y: 20 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 20 }
                            }
                            transition={{ duration: 0.5, delay: 0.4 }}>
                            Everything You Need to Stay Secure
                        </motion.h2>
                        <motion.p
                            className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'
                            initial={{ opacity: 0, y: 20 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 20 }
                            }
                            transition={{ duration: 0.5, delay: 0.6 }}>
                            Our password manager provides all the tools you need
                            to create, store, and manage your passwords
                            securely.
                        </motion.p>
                    </div>
                </motion.div>
                <motion.div
                    className='mx-auto grid grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4'
                    variants={containerVariants}
                    initial='hidden'
                    animate={isInView ? 'show' : 'hidden'}>
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className='flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all duration-200 bg-background/80 backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 group'
                            variants={itemVariants}
                            whileHover={{ scale: 1.03 }}>
                            <motion.div
                                className='rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors'
                                whileHover={{
                                    rotate: [0, 10, -10, 0],
                                    transition: { duration: 0.5 },
                                }}>
                                {feature.icon}
                            </motion.div>
                            <h3 className='text-xl font-bold text-center group-hover:text-primary transition-colors'>
                                {feature.title}
                            </h3>
                            <p className='text-center text-muted-foreground'>
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
