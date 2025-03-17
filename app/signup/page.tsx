'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Header } from '@/components/header';
import { UserPlus } from 'lucide-react';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);

        try {
            await signup(email, password);
            router.push('/vault');
        } catch (error) {
            setError(
                'Failed to create an account. Email may already be in use.'
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className='container px-4 flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 mx-auto'>
                <Card className='w-full max-w-md mx-auto'>
                    <CardHeader className='space-y-1'>
                        <div className='flex justify-center mb-4'>
                            <div className='rounded-full bg-primary/10 p-4'>
                                <UserPlus className='h-8 w-8 text-primary' />
                            </div>
                        </div>
                        <CardTitle className='text-2xl font-bold text-center'>
                            Create an account
                        </CardTitle>
                        <CardDescription className='text-center'>
                            Enter your email and create a password to get
                            started
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className='space-y-4'>
                            {error && (
                                <Alert variant='destructive'>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className='space-y-2'>
                                <Label htmlFor='email'>Email</Label>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='name@example.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='password'>Password</Label>
                                <Input
                                    id='password'
                                    type='password'
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='confirm-password'>
                                    Confirm Password
                                </Label>
                                <Input
                                    id='confirm-password'
                                    type='password'
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className='flex flex-col space-y-4'>
                            <Button
                                type='submit'
                                className='w-full h-10 transition-all duration-300 hover:scale-105'
                                disabled={loading}>
                                {loading
                                    ? 'Creating account...'
                                    : 'Create account'}
                            </Button>
                            <div className='text-center text-sm'>
                                Already have an account?{' '}
                                <Link
                                    href='/login'
                                    className='text-primary hover:underline'>
                                    Login
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </>
    );
}
