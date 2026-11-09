
import { create } from 'zustand'


type IToastContext = {
    msg: string;
    time: number;
    status: 'info' | 'success' | 'warning' | 'error';
    open: boolean;
    openToast: (msg: string, status?: 'info' | 'success' | 'warning' | 'error', time?: number) => void
}

export const useToast = create<IToastContext>(set => ({
    msg: '',
    time: 5000,
    status: 'info',
    open: false,
    openToast: (msg, status = 'info', time = 5000) => {
        set({ msg, time, status, open: true })
        let lastId: NodeJS.Timeout | null = null
        set({ open: true, msg, time, status })
        const id = setTimeout(() => {
            if (lastId) clearTimeout(lastId)
            set({ open: false })
        }, time)

        lastId = setTimeout(() => {
            set({ msg: '', time: 5000, status: 'info', open: false })
            clearTimeout(id)
        }, time + 1000)
    }
}))