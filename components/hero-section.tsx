'use client';

import Link from 'next/link';
import { Shield, Lock, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/animated-button';

export function HeroSection() {
    return (
        <section className='w-full py-12 md:py-24 lg:py-32 bg-background overflow-hidden relative'>
            {/* Animated background elements */}
            <div className='absolute inset-0 overflow-hidden'>
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className='absolute rounded-full bg-primary/5'
                        style={{
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 100 + 50,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, Math.random() * 100 - 50],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    />
                ))}
            </div>

            <div className='px-4 md:px-6 container px-4 mx-auto relative z-10'>
                <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2'>
                    <motion.div
                        className='flex flex-col justify-center space-y-4'
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}>
                        <motion.div
                            className='space-y-2'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}>
                            <motion.h1
                                className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}>
                                Secure Your Digital Life
                            </motion.h1>
                            <motion.p
                                className='max-w-[600px] text-muted-foreground md:text-xl'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.8 }}>
                                Store, manage, and protect all your passwords in
                                one secure vault. Never forget a password again.
                            </motion.p>
                        </motion.div>
                        <motion.div
                            className='flex flex-col gap-2 min-[400px]:flex-row'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.8 }}>
                            <Link href='/signup'>
                                <AnimatedButton
                                    size='lg'
                                    className='h-11'
                                    animationType='gradient'>
                                    Get Started
                                </AnimatedButton>
                            </Link>
                            <Link href='/login'>
                                <AnimatedButton
                                    size='lg'
                                    variant='outline'
                                    className='h-11 hover:bg-primary/10'
                                    animationType='scale'>
                                    Sign In
                                </AnimatedButton>
                            </Link>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        className='flex items-center justify-end'
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            delay: 0.2,
                            duration: 1,
                            type: 'spring',
                        }}>
                        <div className='relative h-[350px] w-[350px] rounded-full bg-muted/50 p-4 flex items-center justify-center backdrop-blur-sm'>
                            <motion.div
                                className='absolute inset-0 flex items-center justify-center'
                                animate={{
                                    rotateZ: [0, 5, 0, -5, 0],
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    repeatType: 'loop',
                                }}>
                                <motion.div
                                    animate={{
                                        boxShadow: [
                                            '0 0 0px rgba(0, 0, 0, 0)',
                                            '0 0 30px rgba(64, 64, 255, 0.5)',
                                            '0 0 0px rgba(0, 0, 0, 0)',
                                        ],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                    }}>
                                    <Lock className='h-32 w-32 text-primary' />
                                </motion.div>
                            </motion.div>
                            <motion.div
                                className='absolute top-10 left-10 bg-background p-3 rounded-full shadow-lg'
                                animate={{
                                    y: [0, -15, 0],
                                    rotateZ: [0, 10, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}>
                                <Shield className='h-10 w-10 text-green-500' />
                            </motion.div>
                            <motion.div
                                className='absolute bottom-10 right-10 bg-background p-3 rounded-full shadow-lg'
                                animate={{
                                    y: [0, -20, 0],
                                    rotateZ: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    delay: 1,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}>
                                <Key className='h-10 w-10 text-blue-500' />
                            </motion.div>
                            {/* Additional floating elements */}
                            <motion.div
                                className='absolute bottom-20 left-20 bg-background p-2 rounded-full shadow-lg'
                                animate={{
                                    y: [0, -10, 0],
                                    x: [0, 10, 0],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}>
                                <div className='h-6 w-6 rounded-full bg-red-500'></div>
                            </motion.div>
                            <motion.div
                                className='absolute top-20 right-20 bg-background p-2 rounded-full shadow-lg'
                                animate={{
                                    y: [0, 15, 0],
                                    x: [0, -5, 0],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 7,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}>
                                <div className='h-4 w-4 rounded-full bg-yellow-500'></div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
