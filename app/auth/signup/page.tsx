import { FormRegister } from "@/module/auth/components/form"
import { createClient } from "@/supabase/server"
import { redirect } from "next/navigation"

const SignUpPage = async () => {

    const client = await createClient()

    const session = await client.auth.getSession()
    if (session.data.session) return redirect('/') // <- This can be changed to the route you want.

    return (
        <div
            className="p-4 flex items-center justify-center h-screen w-full"
        >
            <FormRegister
            />
        </div>
    )
}

export default SignUpPage