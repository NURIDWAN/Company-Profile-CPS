import { TextField } from '@/components/admin/form-fields';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ManagedUser, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Manage Users', href: '/admin/users' },
];

export default function Users({ users }: { users: ManagedUser[] }) {
    const { props } = usePage<SharedData>();
    const currentUserId = props.auth.user.id;
    const [editing, setEditing] = useState<ManagedUser | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const startCreate = () => {
        setEditing(null);
        reset();
    };

    const startEdit = (user: ManagedUser) => {
        setEditing(user);
        setData({ name: user.name, email: user.email, password: '', password_confirmation: '' });
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        const options = { preserveScroll: true, onSuccess: () => reset() };

        if (editing) {
            put(route('admin.users.update', editing.id), options);
        } else {
            post(route('admin.users.store'), options);
        }
    };

    const remove = (user: ManagedUser) => {
        if (user.id === currentUserId) return;
        if (window.confirm(`Delete ${user.name}? This action cannot be undone.`)) {
            destroy(route('admin.users.destroy', user.id), { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold">Manage Users</h2>
                        <p className="text-muted-foreground text-sm">Create and maintain accounts that can access the admin area.</p>
                    </div>
                    <Button type="button" onClick={startCreate}>
                        New User
                    </Button>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
                    <section className="overflow-hidden rounded-xl border">
                        <div className="border-b px-5 py-4">
                            <h3 className="font-semibold">Admin Users</h3>
                            <p className="text-muted-foreground mt-1 text-sm">{users.length} user(s)</p>
                        </div>
                        {users.length === 0 ? (
                            <div className="text-muted-foreground px-5 py-12 text-center text-sm">No users found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[620px] text-sm">
                                    <thead className="bg-muted/40 text-muted-foreground text-left">
                                        <tr>
                                            <th className="px-5 py-3 font-medium">Name</th>
                                            <th className="px-5 py-3 font-medium">Email</th>
                                            <th className="px-5 py-3 font-medium">Status</th>
                                            <th className="px-5 py-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-5 py-4 font-medium">{user.name}</td>
                                                <td className="text-muted-foreground px-5 py-4">{user.email}</td>
                                                <td className="px-5 py-4">
                                                    <Badge variant={user.email_verified_at ? 'secondary' : 'outline'}>
                                                        {user.email_verified_at ? 'Verified' : 'Unverified'}
                                                    </Badge>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex gap-2">
                                                        <Button type="button" variant="outline" size="sm" onClick={() => startEdit(user)}>
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            disabled={user.id === currentUserId || processing}
                                                            onClick={() => remove(user)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    <section className="h-fit rounded-xl border p-5">
                        <h3 className="font-semibold">{editing ? 'Edit User' : 'Create User'}</h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {editing
                                ? 'Update account details. Leave password empty to keep it unchanged.'
                                : 'New users are verified automatically and can log in immediately after creation.'}
                        </p>
                        <form onSubmit={submit} className="mt-5 space-y-4">
                            <TextField
                                id="name"
                                label="Name"
                                value={data.name}
                                onChange={(value) => setData('name', value)}
                                error={errors.name}
                                required
                            />
                            <TextField
                                id="email"
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={(value) => setData('email', value)}
                                error={errors.email}
                                required
                            />
                            <TextField
                                id="password"
                                label={editing ? 'New Password (optional)' : 'Password'}
                                type="password"
                                value={data.password}
                                onChange={(value) => setData('password', value)}
                                error={errors.password}
                                required={!editing}
                            />
                            <TextField
                                id="password_confirmation"
                                label="Confirm Password"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(value) => setData('password_confirmation', value)}
                                error={errors.password_confirmation}
                                required={!editing}
                            />
                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {editing ? 'Save Changes' : 'Create User'}
                                </Button>
                                {editing && (
                                    <Button type="button" variant="outline" onClick={startCreate}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
