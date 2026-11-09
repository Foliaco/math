'use client';
import clsx from "clsx";
import { useToast } from "../hook/useToast"
import { BsInfoCircle } from "react-icons/bs";

const titleByStatus = {
    info: 'information',
    success: 'success',
    warning: 'warning',
    error: 'error'
}
const colorByStatus = {
    info: {
        bg: 'bg-info',
        text: 'text-white'
    },
    success: {
        bg: 'bg-success',
        text: 'text-black'
    },
    warning: {
        bg: 'bg-warning',
        text: 'text-black'
    },
    error: {
        bg: 'bg-error',
        text: 'text-white'
    }
}

export const Toast = () => {
    const { msg, open, status } = useToast()


    return (
        <div className={
            clsx(
                "fixed top-10 transition right-0 left-0 z-50 m-auto w-[80%] lg:w-[30%]",
                {
                    "-translate-y-[200%]": !open,
                    "translate-y-0": open,
                },

            )
        }>
            <div className={
                clsx(
                    "w-full rounded shadow p-3 flex flex-col",
                    colorByStatus[status].bg,
                    colorByStatus[status].text
                )
            }>
                <div className="flex  gap-2">
                    <BsInfoCircle size={20} className={
                        clsx(
                            colorByStatus[status].text
                        )
                    } />
                    <p className="font-medium capitalize">{titleByStatus[status]}</p>
                </div>
                <p className="text-sm mt-1">{msg}</p>
            </div>
        </div>
    )
}
