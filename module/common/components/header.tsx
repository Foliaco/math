'use client';
import { useUser } from '@/module/auth/context/useUser';
import Link from 'next/link'
import { LuMessagesSquare } from 'react-icons/lu';
import { MdFunctions } from 'react-icons/md';
import { ButtonLang } from './../../lang/button';

/**
    * @description Header para el inicio de la aplicacion. Solo muestra el nombre de la app y un boton de unirse al foro.
 */

export const Header = () => {

    const user = useUser(state => state.user)

    return (
        <div className="flex justify-between p-3 ">
            <div className="flex items-center">
                <button className="btn btn-primary btn-circle btn-sm"><MdFunctions size={20} /></button>
                <h1 className="font-bold text-lg ml-2">
                    Math
                    <span className="text-primary mr-2">.</span>
                    <span className="font-semibold text-sm">
                        by Foliacos
                    </span>
                </h1>
            </div>


            <div className="tooltip tooltip-left" data-tip="Cambiar idioma">
                <ButtonLang />
            </div>
            {/* <div className="tooltip tooltip-left" data-tip="Unirse al foro">
                <Link href={user ? '/forum' : 'auth/login'} className="btn btn-primary btn-circle shadow-lg shadow-primary/30"><LuMessagesSquare size={20} /></Link>
            </div> */}

        </div>
    )
}
