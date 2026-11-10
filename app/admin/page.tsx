import type { Metadata } from "next"
import { AdminPage } from "@/module/admin"
import { createClient } from "@/supabase/server"

export const metadata: Metadata = {
    title: "Administración",
    robots: { index: false, follow: false },
}

export default async function AdminPages() {

    const client = await createClient()
    const session = await client.auth.getUser()
    if (!session.data.user) return <div>Unauthorized</div>


    return <AdminPage />
}
