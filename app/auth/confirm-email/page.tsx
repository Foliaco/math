import { SearchParams } from "next/dist/server/request/search-params"
import Link from "next/link";
import { redirect } from "next/navigation";


type Props = {
    searchParams: Promise<SearchParams>
}

const ConfirmEmail = async (props: Props) => {
    const params = await props.searchParams;
    const code = params.code;


    if (code) {
        return redirect('/auth/login')
    }



    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <p>An error occurred during confirmation, the code has expired, or the email address is invalido</p>
            <Link href={'/'} className="btn btn-primary btn-md mt-3">Go to home</Link>
        </div>
    )
}

export default ConfirmEmail