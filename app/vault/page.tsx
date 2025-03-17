'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where,
    serverTimestamp,
    type Timestamp,
} from 'firebase/firestore';
import { encryptPassword, decryptPassword } from '@/lib/encryption';
import {
    Copy,
    Edit,
    Eye,
    EyeOff,
    ExternalLink,
    Plus,
    Trash,
    Search,
} from 'lucide-react';

type PasswordEntry = {
    id: string;
    title: string;
    username: string;
    password: string;
    url?: string;
    notes?: string;
    userId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export default function VaultPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>(
        {}
    );
    const [decryptedPasswords, setDecryptedPasswords] = useState<
        Record<string, string>
    >({});
    const [decryptingIds, setDecryptingIds] = useState<Record<string, boolean>>(
        {}
    );
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [passwordToDelete, setPasswordToDelete] = useState<string | null>(
        null
    );
    const [currentPassword, setCurrentPassword] =
        useState<PasswordEntry | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        username: '',
        password: '',
        url: '',
        notes: '',
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            fetchPasswords();
        }
    }, [user, authLoading, router]);

    const fetchPasswords = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const q = query(
                collection(db, 'passwords'),
                where('userId', '==', user.uid)
            );
            const querySnapshot = await getDocs(q);

            const passwordsData: PasswordEntry[] = [];
            querySnapshot.forEach((doc) => {
                passwordsData.push({
                    id: doc.id,
                    ...doc.data(),
                } as PasswordEntry);
            });

            setPasswords(passwordsData);
        } catch (error) {
            console.error('Error fetching passwords:', error);
            toast({
                title: 'Error',
                description: 'Failed to load passwords',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddPassword = async () => {
        if (!user) return;

        try {
            const encryptedPassword = await encryptPassword(
                formData.password,
                user.uid
            );

            await addDoc(collection(db, 'passwords'), {
                title: formData.title,
                username: formData.username,
                password: encryptedPassword,
                url: formData.url,
                notes: formData.notes,
                userId: user.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            setIsAddDialogOpen(false);
            resetForm();
            fetchPasswords();

            toast({
                title: 'Success',
                description: 'Password added successfully',
            });
        } catch (error) {
            console.error('Error adding password:', error);
            toast({
                title: 'Error',
                description: 'Failed to add password',
                variant: 'destructive',
            });
        }
    };

    const handleEditPassword = async () => {
        if (!user || !currentPassword) return;

        try {
            const encryptedPassword = await encryptPassword(
                formData.password,
                user.uid
            );

            await updateDoc(doc(db, 'passwords', currentPassword.id), {
                title: formData.title,
                username: formData.username,
                password: encryptedPassword,
                url: formData.url,
                notes: formData.notes,
                updatedAt: serverTimestamp(),
            });

            setIsEditDialogOpen(false);
            resetForm();
            fetchPasswords();

            toast({
                title: 'Success',
                description: 'Password updated successfully',
            });
        } catch (error) {
            console.error('Error updating password:', error);
            toast({
                title: 'Error',
                description: 'Failed to update password',
                variant: 'destructive',
            });
        }
    };

    const confirmDeletePassword = (id: string) => {
        setPasswordToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeletePassword = async () => {
        if (!passwordToDelete) return;

        try {
            await deleteDoc(doc(db, 'passwords', passwordToDelete));
            fetchPasswords();

            toast({
                title: 'Success',
                description: 'Password deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting password:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete password',
                variant: 'destructive',
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setPasswordToDelete(null);
        }
    };

    const decryptPasswordById = async (id: string) => {
        if (!user) return null;

        try {
            setDecryptingIds((prev) => ({ ...prev, [id]: true }));

            const passwordEntry = passwords.find((p) => p.id === id);
            if (!passwordEntry) return null;

            const decrypted = await decryptPassword(
                passwordEntry.password,
                user.uid
            );

            setDecryptedPasswords((prev) => ({
                ...prev,
                [id]: decrypted,
            }));

            return decrypted;
        } catch (error) {
            console.error('Error decrypting password:', error);
            toast({
                title: 'Error',
                description: 'Failed to decrypt password',
                variant: 'destructive',
            });
            return null;
        } finally {
            setDecryptingIds((prev) => ({ ...prev, [id]: false }));
        }
    };

    const togglePasswordVisibility = async (id: string) => {
        if (!user) return;

        // If we're showing the password and haven't decrypted it yet
        if (!showPassword[id] && !decryptedPasswords[id]) {
            await decryptPasswordById(id);
        }

        setShowPassword((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const copyToClipboard = async (id: string, type: string) => {
        if (!user) return;

        try {
            if (type === 'Password') {
                // If we haven't decrypted this password yet
                let passwordText = decryptedPasswords[id];
                if (!passwordText) {
                    passwordText = (await decryptPasswordById(id)) || '';
                }

                if (passwordText) {
                    navigator.clipboard.writeText(passwordText);
                }
            } else {
                // For username
                const passwordEntry = passwords.find((p) => p.id === id);
                if (passwordEntry) {
                    navigator.clipboard.writeText(passwordEntry.username);
                }
            }

            toast({
                title: 'Copied',
                description: `${type} copied to clipboard`,
            });
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            toast({
                title: 'Error',
                description: `Failed to copy ${type}`,
                variant: 'destructive',
            });
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            username: '',
            password: '',
            url: '',
            notes: '',
        });
        setCurrentPassword(null);
    };

    const openEditDialog = async (password: PasswordEntry) => {
        if (!user) return;

        try {
            setDecryptingIds((prev) => ({ ...prev, [password.id]: true }));
            const decryptedPassword = await decryptPassword(
                password.password,
                user.uid
            );

            setCurrentPassword(password);
            setFormData({
                title: password.title,
                username: password.username,
                password: decryptedPassword,
                url: password.url || '',
                notes: password.notes || '',
            });
            setIsEditDialogOpen(true);
        } catch (error) {
            console.error('Error decrypting password for edit:', error);
            toast({
                title: 'Error',
                description: 'Failed to decrypt password for editing',
                variant: 'destructive',
            });
        } finally {
            setDecryptingIds((prev) => ({ ...prev, [password.id]: false }));
        }
    };

    const filteredPasswords = passwords.filter(
        (password) =>
            password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            password.username
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (password.url &&
                password.url
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())) ||
            (password.notes &&
                password.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <>
            <Header />
            <div className='container px-4 py-8 mx-auto'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
                    <div>
                        <h1 className='text-3xl font-bold'>Password Vault</h1>
                        <p className='text-muted-foreground'>
                            {passwords.length} passwords stored securely
                        </p>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-4 w-full md:w-auto'>
                        <div className='relative w-full sm:w-64'>
                            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                            <Input
                                type='text'
                                placeholder='Search passwords...'
                                className='pl-8'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Dialog
                            open={isAddDialogOpen}
                            onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className='h-10'>
                                    <Plus className='mr-2 h-4 w-4' /> Add
                                    Password
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Password</DialogTitle>
                                    <DialogDescription>
                                        Add a new password to your secure vault.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className='grid gap-4 py-4'>
                                    <div className='grid gap-2'>
                                        <Label htmlFor='title'>Title</Label>
                                        <Input
                                            id='title'
                                            placeholder='Google Account'
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    title: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className='grid gap-2'>
                                        <Label htmlFor='username'>
                                            Username/Email
                                        </Label>
                                        <Input
                                            id='username'
                                            placeholder='user@example.com'
                                            value={formData.username}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    username: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className='grid gap-2'>
                                        <Label htmlFor='password'>
                                            Password
                                        </Label>
                                        <Input
                                            id='password'
                                            type='password'
                                            value={formData.password}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    password: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className='grid gap-2'>
                                        <Label htmlFor='url'>
                                            Website URL (optional)
                                        </Label>
                                        <Input
                                            id='url'
                                            placeholder='https://example.com'
                                            value={formData.url}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    url: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className='grid gap-2'>
                                        <Label htmlFor='notes'>
                                            Notes (optional)
                                        </Label>
                                        <Textarea
                                            id='notes'
                                            placeholder='Additional information...'
                                            value={formData.notes}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    notes: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant='outline'
                                        onClick={() =>
                                            setIsAddDialogOpen(false)
                                        }>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddPassword}>
                                        Save
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {loading ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {[...Array(6)].map((_, i) => (
                            <Card
                                key={i}
                                className='overflow-hidden p-6'>
                                <div className='pb-2'>
                                    <Skeleton className='h-6 w-3/4' />
                                    <Skeleton className='h-4 w-1/2 mt-2' />
                                </div>
                                <div className='pb-2 mt-4'>
                                    <div className='space-y-2'>
                                        <Skeleton className='h-4 w-full' />
                                        <Skeleton className='h-4 w-full' />
                                        <Skeleton className='h-4 w-2/3' />
                                    </div>
                                </div>
                                <div className='mt-4 pt-4 border-t'>
                                    <Skeleton className='h-4 w-full' />
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : filteredPasswords.length === 0 ? (
                    <div className='text-center py-12'>
                        <h2 className='text-xl font-semibold mb-2'>
                            No passwords found
                        </h2>
                        <p className='text-muted-foreground mb-6'>
                            {searchTerm
                                ? 'No passwords match your search'
                                : 'Add your first password to get started'}
                        </p>
                        {!searchTerm && (
                            <Button onClick={() => setIsAddDialogOpen(true)}>
                                <Plus className='mr-2 h-4 w-4' /> Add Password
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filteredPasswords.map((password) => (
                            <div
                                key={password.id}
                                className='bg-card rounded-lg border shadow-sm p-6 transition-all duration-300 hover:shadow-md flex flex-col h-full'>
                                <div className='flex flex-col justify-between h-full'>
                                    <div>
                                        <div className='flex justify-between items-start mb-4'>
                                            <h3 className='text-xl font-semibold'>
                                                {password.title}
                                            </h3>
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                className='h-8 w-8'
                                                onClick={() => {
                                                    if (password.url) {
                                                        window.open(
                                                            password.url.startsWith(
                                                                'http'
                                                            )
                                                                ? password.url
                                                                : `https://${password.url}`,
                                                            '_blank'
                                                        );
                                                    }
                                                }}
                                                disabled={!password.url}>
                                                <ExternalLink className='h-4 w-4' />
                                            </Button>
                                        </div>

                                        <div className='space-y-4'>
                                            <div>
                                                <div className='text-sm text-muted-foreground mb-1'>
                                                    Username
                                                </div>
                                                <div className='flex items-center justify-between'>
                                                    <div className='text-sm'>
                                                        {password.username}
                                                    </div>
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        className='h-8 w-8'
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                password.id,
                                                                'Username'
                                                            )
                                                        }>
                                                        <Copy className='h-4 w-4' />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div>
                                                <div className='text-sm text-muted-foreground mb-1'>
                                                    Password
                                                </div>
                                                <div className='flex items-center justify-between'>
                                                    <div className='text-sm font-mono'>
                                                        {showPassword[
                                                            password.id
                                                        ]
                                                            ? decryptedPasswords[
                                                                  password.id
                                                              ] ||
                                                              '••••••••••••'
                                                            : '••••••••••••'}
                                                    </div>
                                                    <div className='flex'>
                                                        <Button
                                                            variant='ghost'
                                                            size='icon'
                                                            className='h-8 w-8'
                                                            onClick={() =>
                                                                togglePasswordVisibility(
                                                                    password.id
                                                                )
                                                            }
                                                            disabled={
                                                                decryptingIds[
                                                                    password.id
                                                                ]
                                                            }>
                                                            {decryptingIds[
                                                                password.id
                                                            ] ? (
                                                                <span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                                                            ) : showPassword[
                                                                  password.id
                                                              ] ? (
                                                                <EyeOff className='h-4 w-4' />
                                                            ) : (
                                                                <Eye className='h-4 w-4' />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant='ghost'
                                                            size='icon'
                                                            className='h-8 w-8'
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    password.id,
                                                                    'Password'
                                                                )
                                                            }
                                                            disabled={
                                                                decryptingIds[
                                                                    password.id
                                                                ]
                                                            }>
                                                            <Copy className='h-4 w-4' />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {password.notes && (
                                                <div>
                                                    <div className='text-sm text-muted-foreground mb-1'>
                                                        Notes
                                                    </div>
                                                    <div className='text-sm'>
                                                        {password.notes}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-between pt-4 mt-4 border-t'>
                                        <div className='text-xs text-muted-foreground'>
                                            Updated:{' '}
                                            {new Date(
                                                password.updatedAt.toDate()
                                            ).toLocaleDateString()}
                                        </div>
                                        <div className='flex space-x-1'>
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                className='h-8 w-8'
                                                onClick={() =>
                                                    openEditDialog(password)
                                                }
                                                disabled={
                                                    decryptingIds[password.id]
                                                }>
                                                {decryptingIds[password.id] ? (
                                                    <span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                                                ) : (
                                                    <Edit className='h-4 w-4' />
                                                )}
                                            </Button>
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                className='h-8 w-8 text-destructive'
                                                onClick={() =>
                                                    confirmDeletePassword(
                                                        password.id
                                                    )
                                                }>
                                                <Trash className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Password</DialogTitle>
                            <DialogDescription>
                                Update your password details.
                            </DialogDescription>
                        </DialogHeader>
                        <div className='grid gap-4 py-4'>
                            <div className='grid gap-2'>
                                <Label htmlFor='edit-title'>Title</Label>
                                <Input
                                    id='edit-title'
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor='edit-username'>
                                    Username/Email
                                </Label>
                                <Input
                                    id='edit-username'
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            username: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor='edit-password'>Password</Label>
                                <Input
                                    id='edit-password'
                                    type='password'
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor='edit-url'>
                                    Website URL (optional)
                                </Label>
                                <Input
                                    id='edit-url'
                                    value={formData.url}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            url: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor='edit-notes'>
                                    Notes (optional)
                                </Label>
                                <Textarea
                                    id='edit-notes'
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            notes: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant='outline'
                                onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditPassword}>
                                Save changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Password</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this password?
                                This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className='gap-2 sm:gap-0'>
                            <Button
                                variant='outline'
                                onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant='destructive'
                                onClick={handleDeletePassword}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
