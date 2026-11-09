'use client';

import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdEmail, MdKey } from "react-icons/md";
import { login, signUp } from "../actions/session";
import { useToast } from "@/module/common/hook/useToast";
import clsx from "clsx";
import { useUser } from "../context/useUser";
import { useRouter } from "next/navigation";


type FormLoginProps = {
    redirectTo?: string
}

export const FormLogin = ({ redirectTo }: FormLoginProps) => {

    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({ email: '', password: '' })
    const { openToast } = useToast()
    const updateUser = useUser(state => state.updateUser);
    const router = useRouter()

    const auth = async () => {
        if (!user.email || !user.password) return openToast('Please enter email and password', 'warning')
        setLoading(true)
        const response = await login(user.email, user.password)
        setLoading(false)
        if (response.error) {
            return openToast(response.error.message, 'error')
        }
        updateUser(response.data.user)
        openToast('Login successfully - redirecting...', 'success', 3000)
        router.push(redirectTo || '/')
    }

    return (
        <div className="p-10 shadow w-[500px] h-min flex flex-col">
            <h2 className="text-md font-medium border-b border-b-neutral/20 pb-2 mb-2">Login</h2>

            <div className="w-full">
                <fieldset className="fieldset">
                    <label htmlFor="email" className="fieldset-legend">
                        <span className="label-text">Email</span>
                    </label>
                    <div className="join w-full">
                        <div className={
                            clsx(
                                "join-item border border-neutral/20 flex items-center justify-center w-[50px]",
                                {
                                    "bg-black/10": loading
                                }
                            )
                        }>
                            <MdEmail className={
                                clsx(
                                    {
                                        "text-primary": !loading,
                                        "text-primary/50 cursor-not-allowed": loading
                                    }
                                )
                            } size={24} />
                        </div>
                        <input
                            disabled={loading}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            value={user.email}
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="input w-full join-item"
                        />
                    </div>
                </fieldset>
                <fieldset className="fieldset">
                    <label htmlFor="password" className="fieldset-legend">
                        <span className="label-text">Passowrd</span>
                    </label>
                    <div className="join w-full">
                        <div className={
                            clsx(
                                "join-item border border-neutral/20 flex items-center justify-center w-[50px]",
                                {
                                    "bg-black/10 ": loading
                                }
                            )
                        }>
                            <MdKey className={
                                clsx(
                                    {
                                        "text-primary": !loading,
                                        "text-primary/50 cursor-not-allowed": loading
                                    }
                                )
                            } size={24} />
                        </div>
                        <input
                            disabled={loading}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            value={user.password}
                            name="password"
                            type={showPass ? "text" : "password"}
                            className="input w-full join-item"
                        />
                        <button disabled={loading} onClick={() => setShowPass(!showPass)} type="button" className="btn btn-outline border-neutral/20  join-item shadow-none">
                            {
                                showPass ?
                                    <IoMdEyeOff />
                                    :
                                    <IoMdEye />

                            }
                        </button>
                    </div>
                </fieldset>

                <button onClick={auth} disabled={loading} className="btn btn-primary w-full mt-5">
                    {
                        loading ?
                            <span className="loading loading-spinner"></span>
                            :
                            "Login"
                    }
                </button>
            </div>
        </div>
    )
}


export const FormRegister = () => {

    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({ email: '', password: '', passwordConfirmation: '', sendEmailConfirmation: false })
    const { openToast } = useToast()
    const router = useRouter()

    const auth = async () => {
        if (!user.email || !user.password) return openToast('Please enter email and password', 'warning')
        setLoading(true)
        const response = await signUp(user.email, user.password)
        setLoading(false)
        if (response.error) {
            return openToast(response.error.message, 'error')
        }
        if (response.data.user) {
            if (!response.data.user.email_confirmed_at) {
                setUser({ ...user, sendEmailConfirmation: true })
                openToast('User created successfully, please check your email to confirm your account', 'success', 3000)
                return;
            }
        }
    }

    return (
        <div className="p-10 shadow w-[500px] h-min flex flex-col transition-all">
            <h2 className="text-md font-medium border-b border-b-neutral/20 pb-2 mb-2">Login</h2>

            <div className="w-full">
                <fieldset className="fieldset">
                    <label htmlFor="email" className="fieldset-legend">
                        <span className="label-text">Email</span>
                    </label>
                    <div className="join w-full">
                        <div className={
                            clsx(
                                "join-item border border-neutral/20 flex items-center justify-center w-[50px]",
                                {
                                    "bg-black/10": loading
                                }
                            )
                        }>
                            <MdEmail className={
                                clsx(
                                    {
                                        "text-primary": !loading,
                                        "text-primary/50 cursor-not-allowed": loading
                                    }
                                )
                            } size={24} />
                        </div>
                        <input
                            disabled={loading}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            value={user.email}
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="input w-full join-item"
                        />
                    </div>
                </fieldset>
                <fieldset className="fieldset">
                    <label htmlFor="password" className="fieldset-legend">
                        <span className="label-text">Passowrd</span>
                    </label>
                    <div className="join w-full">
                        <div className={
                            clsx(
                                "join-item border border-neutral/20 flex items-center justify-center w-[50px]",
                                {
                                    "bg-black/10 ": loading
                                }
                            )
                        }>
                            <MdKey className={
                                clsx(
                                    {
                                        "text-primary": !loading,
                                        "text-primary/50 cursor-not-allowed": loading
                                    }
                                )
                            } size={24} />
                        </div>
                        <input
                            disabled={loading}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            value={user.password}
                            name="password"
                            type={showPass ? "text" : "password"}
                            className="input w-full join-item"
                        />
                        <button disabled={loading} onClick={() => setShowPass(!showPass)} type="button" className="btn btn-outline border-neutral/20  join-item shadow-none">
                            {
                                showPass ?
                                    <IoMdEyeOff />
                                    :
                                    <IoMdEye />

                            }
                        </button>
                    </div>
                </fieldset>
                <fieldset className="fieldset">
                    <label htmlFor="password" className="fieldset-legend">
                        <span className="label-text">Confirm Passowrd</span>
                    </label>
                    <div className="join w-full">
                        <div className={
                            clsx(
                                "join-item border border-neutral/20 flex items-center justify-center w-[50px]",
                                {
                                    "bg-black/10 ": loading
                                }
                            )
                        }>
                            <MdKey className={
                                clsx(
                                    {
                                        "text-primary": !loading,
                                        "text-primary/50 cursor-not-allowed": loading
                                    }
                                )
                            } size={24} />
                        </div>
                        <input
                            disabled={loading}
                            onChange={(e) => setUser({ ...user, passwordConfirmation: e.target.value })}
                            value={user.passwordConfirmation}
                            name="password"
                            type={showPass ? "text" : "password"}
                            className="input w-full join-item"
                        />
                        <button disabled={loading} onClick={() => setShowPass(!showPass)} type="button" className="btn btn-outline border-neutral/20  join-item shadow-none">
                            {
                                showPass ?
                                    <IoMdEyeOff />
                                    :
                                    <IoMdEye />

                            }
                        </button>
                    </div>
                    {
                        ((user.password !== user.passwordConfirmation) && user.passwordConfirmation) &&
                        <span className="label-text-alt text-error">Password and Confirm Password must be the same</span>
                    }
                </fieldset>

                <button onClick={auth} disabled={loading || user.passwordConfirmation !== user.password} className="btn btn-primary w-full mt-5">
                    {
                        loading ?
                            <span className="loading loading-spinner"></span>
                            :
                            "Sign Up"
                    }
                </button>
                {
                    user.sendEmailConfirmation &&
                    <div>
                        <div className="divider" />
                        <button className="btn btn-primary w-full" onClick={() => router.replace('/auth/login')}>Go to login</button>
                        <p className="label-text-alt text-sm mt-2 ">Please check your email to confirm your account</p>
                    </div>
                }
            </div>
        </div>
    )
}