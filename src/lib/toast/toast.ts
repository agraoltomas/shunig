import { type ToastServiceMethods, useToast as uT } from 'primevue'
type ExtraFunction = (msg: string) => void
export const useToast = () =>{
    const toast = uT()
    const add = toast.add;
    toast.add = (conf) => {
        conf.life = conf.life ?? 3000
        return add.bind(toast)(conf)
    }
    return toast
}