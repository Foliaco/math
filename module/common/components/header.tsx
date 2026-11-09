'use client';
import { useUser } from '@/module/auth/context/useUser';
import Link from 'next/link'

export const Header = () => {

    const user = useUser(state => state.user)

    return (
        <div className="flex justify-between p-3  shadow">
            <h3 className="text-xl font-medium">Template with login - NextJS + Supabase</h3>
            <div className="join join-horizontal">

                {
                    user ?
                        <Link className="join-item btn btn-primary btn-sm shadow-none" href={'/admin'} >Admin</Link>
                        :
                        <>
                            <Link className="join-item btn btn-primary btn-sm shadow-none" href={'/auth/login'} >Login</Link>
                            <Link className="join-item btn btn-neutral btn-outline btn-sm shadow-none" href={'/auth/signup'} >Sign Up</Link>
                        </>
                }
            </div>
        </div>
    )
}
