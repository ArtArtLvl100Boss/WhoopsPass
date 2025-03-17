'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Copy, RefreshCw } from 'lucide-react';

export default function GeneratorPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else {
            generatePassword();
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        generatePassword();
    }, [
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
    ]);

    useEffect(() => {
        calculatePasswordStrength();
    }, [password]);

    const generatePassword = () => {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        let chars = '';
        if (includeLowercase) chars += lowercase;
        if (includeUppercase) chars += uppercase;
        if (includeNumbers) chars += numbers;
        if (includeSymbols) chars += symbols;

        if (chars === '') {
            setIncludeLowercase(true);
            chars = lowercase;
        }

        let generatedPassword = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            generatedPassword += chars[randomIndex];
        }

        setPassword(generatedPassword);
    };

    const calculatePasswordStrength = () => {
        let strength = 0;

        // Length factor
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        if (password.length >= 16) strength += 1;

        // Character variety
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        setPasswordStrength(Math.min(strength, 5));
    };

    const getStrengthText = () => {
        if (passwordStrength <= 1) return 'Very Weak';
        if (passwordStrength === 2) return 'Weak';
        if (passwordStrength === 3) return 'Moderate';
        if (passwordStrength === 4) return 'Strong';
        return 'Very Strong';
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 1) return 'bg-red-500';
        if (passwordStrength === 2) return 'bg-orange-500';
        if (passwordStrength === 3) return 'bg-yellow-500';
        if (passwordStrength === 4) return 'bg-green-500';
        return 'bg-emerald-500';
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        toast({
            title: 'Copied',
            description: 'Password copied to clipboard',
        });
    };

    return (
        <>
            <Header />
            <div className='container px-4 py-8 mx-auto'>
                <div className='max-w-2xl mx-auto'>
                    <h1 className='text-3xl font-bold mb-2'>
                        Password Generator
                    </h1>
                    <p className='text-muted-foreground mb-6'>
                        Create strong, secure passwords
                    </p>

                    <Card className='mb-6 transition-all duration-300 hover:shadow-md'>
                        <CardHeader className='pb-4'>
                            <CardTitle>Generated Password</CardTitle>
                            <CardDescription>
                                Your secure password is ready to use
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='pb-4'>
                            <div className='flex items-center gap-2 mb-4'>
                                <Input
                                    value={password}
                                    readOnly
                                    className='font-mono text-lg h-10'
                                />
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='h-10 w-10'
                                    onClick={copyToClipboard}>
                                    <Copy className='h-4 w-4' />
                                    <span className='sr-only'>
                                        Copy password
                                    </span>
                                </Button>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='h-10 w-10'
                                    onClick={generatePassword}>
                                    <RefreshCw className='h-4 w-4' />
                                    <span className='sr-only'>
                                        Generate new password
                                    </span>
                                </Button>
                            </div>

                            <div className='space-y-2'>
                                <div className='flex justify-between text-sm'>
                                    <span>Password Strength:</span>
                                    <span className='font-medium'>
                                        {getStrengthText()}
                                    </span>
                                </div>
                                <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
                                    <div
                                        className={`h-full ${getStrengthColor()} transition-all duration-500`}
                                        style={{
                                            width: `${
                                                (passwordStrength / 5) * 100
                                            }%`,
                                        }}></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='transition-all duration-300 hover:shadow-md'>
                        <CardHeader>
                            <CardTitle>Password Options</CardTitle>
                            <CardDescription>
                                Customize your password generation settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='space-y-2'>
                                <div className='flex justify-between'>
                                    <Label htmlFor='length'>
                                        Password Length: {length}
                                    </Label>
                                </div>
                                <Slider
                                    id='length'
                                    min={8}
                                    max={32}
                                    step={1}
                                    value={[length]}
                                    onValueChange={(value) =>
                                        setLength(value[0])
                                    }
                                    className='py-4'
                                />
                            </div>

                            <div className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <Label htmlFor='uppercase'>
                                        Include Uppercase Letters (A-Z)
                                    </Label>
                                    <Switch
                                        id='uppercase'
                                        checked={includeUppercase}
                                        onCheckedChange={setIncludeUppercase}
                                    />
                                </div>

                                <div className='flex items-center justify-between'>
                                    <Label htmlFor='lowercase'>
                                        Include Lowercase Letters (a-z)
                                    </Label>
                                    <Switch
                                        id='lowercase'
                                        checked={includeLowercase}
                                        onCheckedChange={setIncludeLowercase}
                                    />
                                </div>

                                <div className='flex items-center justify-between'>
                                    <Label htmlFor='numbers'>
                                        Include Numbers (0-9)
                                    </Label>
                                    <Switch
                                        id='numbers'
                                        checked={includeNumbers}
                                        onCheckedChange={setIncludeNumbers}
                                    />
                                </div>

                                <div className='flex items-center justify-between'>
                                    <Label htmlFor='symbols'>
                                        Include Symbols (!@#$%^&*)
                                    </Label>
                                    <Switch
                                        id='symbols'
                                        checked={includeSymbols}
                                        onCheckedChange={setIncludeSymbols}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={generatePassword}
                                className='w-full h-10 transition-all duration-300 hover:scale-105'>
                                <RefreshCw className='mr-2 h-4 w-4' />
                                Generate New Password
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}
