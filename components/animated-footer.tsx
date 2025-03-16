'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Lock, Github, Twitter, Shield } from 'lucide-react';

export function AnimatedFooter() {
    const footerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(footerRef, { once: true, amount: 0.2 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 },
        },
    };

    return (
        <footer
            ref={footerRef}
            className='border-t py-12 md:py-16 bg-background/50 backdrop-blur-sm relative overflow-hidden'>
            {/* Animated background elements */}
            <div className='absolute inset-0 overflow-hidden z-0'>
                {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className='absolute rounded-full bg-primary/5'
                        style={{
                            width: Math.random() * 80 + 40,
                            height: Math.random() * 80 + 40,
                            left: `${Math.random() * 100}%`,
                            bottom: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, Math.random() * 80 - 40],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{
                            duration: Math.random() * 8 + 8,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    />
                ))}
            </div>

            <div className='container mx-auto relative z-10'>
                <motion.div
                    className='grid grid-cols-1 md:grid-cols-3 gap-8'
                    variants={containerVariants}
                    initial='hidden'
                    animate={isInView ? 'visible' : 'hidden'}>
                    <motion.div variants={itemVariants}>
                        <div className='flex items-center gap-2 mb-4'>
                            <motion.div
                                whileHover={{ rotate: 20 }}
                                transition={{ type: 'spring', stiffness: 300 }}>
                                <Lock className='h-6 w-6 text-primary' />
                            </motion.div>
                            <span className='font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600'>
                                WhoopsPass
                            </span>
                        </div>
                        <p className='text-muted-foreground'>
                            Your personal password manager with strong
                            encryption and easy access across all devices.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <h3 className='font-semibold mb-4'>Quick Links</h3>
                        <div className='flex flex-col space-y-2'>
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Features', href: '/#features' },
                                { name: 'Vault', href: '/vault' },
                                { name: 'Generator', href: '/generator' },
                            ].map((link) => (
                                <motion.div
                                    key={link.name}
                                    whileHover={{ x: 5 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                    }}>
                                    <Link
                                        href={link.href}
                                        className='text-muted-foreground hover:text-primary transition-colors'>
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <h3 className='font-semibold mb-4'>Security</h3>
                        <div className='flex items-center gap-2 mb-2'>
                            <Shield className='h-4 w-4 text-green-500' />
                            <span className='text-muted-foreground'>
                                End-to-end encryption
                            </span>
                        </div>
                        <div className='flex items-center gap-2 mb-4'>
                            <Shield className='h-4 w-4 text-green-500' />
                            <span className='text-muted-foreground'>
                                Zero-knowledge architecture
                            </span>
                        </div>
                        <div className='flex space-x-4 mt-6'>
                            <motion.a
                                href='https://github.com'
                                target='_blank'
                                rel='noopener noreferrer'
                                whileHover={{ y: -5, scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className='text-muted-foreground hover:text-primary'>
                                <Github className='h-5 w-5' />
                            </motion.a>
                            <motion.a
                                href='https://twitter.com'
                                target='_blank'
                                rel='noopener noreferrer'
                                whileHover={{ y: -5, scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className='text-muted-foreground hover:text-primary'>
                                <Twitter className='h-5 w-5' />
                            </motion.a>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    className='mt-12 pt-6 border-t text-center text-sm text-muted-foreground'
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ delay: 0.6, duration: 0.5 }}>
                    <motion.p
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 300 }}>
                        © {new Date().getFullYear()} SecureVault. All rights
                        reserved.
                    </motion.p>
                </motion.div>
            </div>
        </footer>
    );
}
