import { AxiosError, type AxiosResponse } from 'axios'
import type { MessageResponse } from '@/lib/tipos/generics'
import type { ToastServiceMethods } from 'primevue'

interface ErrorReponse extends MessageResponse<never> {
    ok: false
}

export const useResponse = () => {
    const unwrap = async <T = any>(r: Promise<AxiosResponse>) => {
        const r_2: MessageResponse<T> = (await r).data
        return r_2
    }

    const tryUnwrapError = (e: Error) => {
        if (e instanceof AxiosError) {
            return unwrapError(e as AxiosError<ErrorReponse>)
        } else {
            return null
        }

    }
    const unwrapError = (e: AxiosError<ErrorReponse>) => {
        if (!e.response) return null
        const r_2: ErrorReponse = e.response?.data
        return r_2
    }
    const tryLogError = (e: Error, toast: ToastServiceMethods) => {
        const r = tryUnwrapError(e as AxiosError<ErrorReponse>)
        if (!r || !r.message) return null
        toast.add({ severity: 'error', detail: r.message });

    }
    return {
        unwrap,
        unwrapError,
        tryUnwrapError,
        tryLogError,
    }
}