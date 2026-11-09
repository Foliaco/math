'use client';

import { useUser } from "@/module/auth/context/useUser";
import { User } from "@supabase/supabase-js";
import { useEffect } from "react";
import { Toast } from "@/module/common/components/toast";


type LayoutClientProps = {
    children: React.ReactNode;
    user: User | null;
}

export const LayoutClient = ({ children, user }: LayoutClientProps) => {

    const updateUser = useUser(state => state.updateUser)
    useEffect(() => {
        if (user) {
            updateUser(user)
        }
    }, [user, updateUser])


    return <>
        {children}
        <Toast />
    </>
}
