import {useToast as uT} from "primevue"
export const useToast = () =>{
    const toast = uT()
    const add = toast.add;
    toast.add = (conf) => {
        return add.bind(toast)({ ...conf,life: 3000 })
    }
    return toast
}