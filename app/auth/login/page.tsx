import { FormLogin } from "@/module/auth/components/form"
import { createClient } from "@/supabase/server"
import { redirect } from "next/navigation"

const LoginPage = async () => {

    const client = await createClient()

    const session = await client.auth.getUser()
    if (session.data.user) return redirect('/') // <- This can be changed to the route you want.

    return (
        <div
            className="p-4 flex items-center justify-center h-screen w-full"
        >
            <FormLogin
                redirectTo="/"
            />
        </div>
    )
}

export default LoginPage