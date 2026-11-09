import { AdminPage } from "@/module/admin"
import { createClient } from "@/supabase/server"


export default async function AdminPages() {

    const client = await createClient()
    const session = await client.auth.getUser()
    if (!session.data.user) return <div>Unauthorized</div>


    return <AdminPage />
}
