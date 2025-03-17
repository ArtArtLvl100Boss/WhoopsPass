'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { useAuth } from '@/lib/auth-context';
import { LogOut, Lock, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigation = [
        { name: 'Home', href: '/' },
        ...(user
            ? [
                  { name: 'Vault', href: '/vault' },
                  { name: 'Generator', href: '/generator' },
              ]
            : []),
    ];

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const headerClasses = cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300',
        scrolled ? 'shadow-md' : ''
    );

    return (
        <motion.header
            className={headerClasses}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}>
            <div className='flex h-16 items-center justify-between container px-4 mx-auto'>
                <motion.div
                    className='flex items-center gap-2'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}>
                    <Link
                        href='/'
                        className='flex items-center gap-2 group'>
                        <motion.div
                            whileHover={{ rotate: 20 }}
                            transition={{ type: 'spring', stiffness: 300 }}>
                            <Lock className='h-6 w-6 transition-colors group-hover:text-primary' />
                        </motion.div>
                        <motion.span
                            className='font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600'
                            whileHover={{ scale: 1.05 }}>
                            WhoopsPass
                        </motion.span>
                    </Link>
                </motion.div>

                {/* Desktop navigation */}
                <nav className='hidden md:flex items-center gap-6'>
                    <div className='flex gap-4'>
                        {navigation.map((item, index) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.1 * index,
                                    duration: 0.5,
                                }}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'text-sm font-medium transition-colors hover:text-primary relative',
                                        pathname === item.href
                                            ? 'text-foreground'
                                            : 'text-muted-foreground'
                                    )}>
                                    {item.name}
                                    {pathname === item.href && (
                                        <motion.div
                                            className='absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary'
                                            layoutId='underline'
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className='flex items-center gap-2'>
                        <ModeToggle />
                        {user ? (
                            <motion.div
                                className='flex items-center gap-2'
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}>
                                            <Button
                                                variant='ghost'
                                                className='relative h-10 w-10 rounded-full overflow-hidden'>
                                                <Avatar className='h-8 w-8'>
                                                    <AvatarFallback className='bg-gradient-to-tr from-primary to-blue-600 text-white'>
                                                        {user.email
                                                            ?.charAt(0)
                                                            .toUpperCase() ||
                                                            'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </motion.div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                        <DropdownMenuItem className='cursor-default'>
                                            {user.email}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleLogout}>
                                            <LogOut className='mr-2 h-4 w-4' />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </motion.div>
                        ) : (
                            <motion.div
                                className='flex items-center gap-2'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}>
                                <Link href='/login'>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        className='h-10 hover:scale-105 transition-transform'>
                                        Log in
                                    </Button>
                                </Link>
                                <Link href='/signup'>
                                    <Button
                                        size='sm'
                                        className='h-10 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 hover:scale-105 transition-transform'>
                                        Sign up
                                    </Button>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </nav>

                {/* Mobile menu button */}
                <motion.div
                    className='flex md:hidden'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label='Toggle menu'>
                        <AnimatePresence
                            mode='wait'
                            initial={false}>
                            {mobileMenuOpen ? (
                                <motion.div
                                    key='close'
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.2 }}>
                                    <X className='h-6 w-6' />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key='menu'
                                    initial={{ opacity: 0, rotate: 90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: -90 }}
                                    transition={{ duration: 0.2 }}>
                                    <Menu className='h-6 w-6' />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </motion.div>
            </div>

            {/* Mobile navigation */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className='md:hidden py-4 px-4 border-t'
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}>
                        <nav className='flex flex-col space-y-4'>
                            {navigation.map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: 0.05 * index,
                                        duration: 0.3,
                                    }}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'text-sm font-medium transition-colors hover:text-primary',
                                            pathname === item.href
                                                ? 'text-foreground'
                                                : 'text-muted-foreground'
                                        )}
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }>
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                            {user ? (
                                <>
                                    <motion.div
                                        className='text-sm text-muted-foreground'
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.2,
                                            duration: 0.3,
                                        }}>
                                        {user.email}
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.25,
                                            duration: 0.3,
                                        }}>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={handleLogout}
                                            className='justify-start w-full'>
                                            <LogOut className='mr-2 h-4 w-4' />
                                            Log out
                                        </Button>
                                    </motion.div>
                                </>
                            ) : (
                                <motion.div
                                    className='flex flex-col space-y-2'
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.3 }}>
                                    <Link href='/login'>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            className='w-full'>
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href='/signup'>
                                        <Button
                                            size='sm'
                                            className='w-full bg-gradient-to-r from-primary to-blue-600'>
                                            Sign up
                                        </Button>
                                    </Link>
                                </motion.div>
                            )}
                            <motion.div
                                className='pt-2'
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.3 }}>
                                <ModeToggle />
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
