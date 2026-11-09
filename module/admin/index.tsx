'use client';

import { useState } from 'react';
import { useUser } from '../auth/context/useUser'
import { logout } from '../auth/actions/session';
import { useRouter } from 'next/navigation';

export const AdminPage = () => {
    const { user, exit: _exit } = useUser()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const exit = async () => {
        setLoading(true)
        await logout()
        _exit()
        setLoading(false)
        router.push('/')
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="card shadow-xl bg-base-100">
                    <div className="card-body">
                        <h2 className="card-title">Administration panel</h2>

                        {!user ? (
                            <div className="alert">
                                <span>No user is logged in.</span>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold">ID:</p>
                                    <p className="text-sm opacity-80">{user.id}</p>
                                </div>

                                <div>
                                    <p className="font-semibold">Email:</p>
                                    <p className="text-sm opacity-80">{user.email}</p>
                                </div>

                                {user.user_metadata?.full_name && (
                                    <div>
                                        <p className="font-semibold">Name:</p>
                                        <p className="text-sm opacity-80">
                                            {user.user_metadata.full_name}
                                        </p>
                                    </div>
                                )}

                                <div className="divider"></div>

                                <button onClick={exit} disabled={loading} className="btn btn-neutral w-full">
                                    Log out
                                    {
                                        loading && <span className="loading loading-spinner"></span>
                                    }
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
