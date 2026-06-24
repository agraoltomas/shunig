import { type Ref, ref } from 'vue'
import { v7 } from 'uuid'
interface ProcessResponse{
    tipo: 'RESPONSE',
    process: string
}
export const isProcessReponse = (d: any): d is ProcessResponse  => {
    return d.tipo === 'RESPONSE' && !!d.process
}
export const useProcess = () => {
    const processes: Ref<{[k: string]: (value: any) => void}> = ref({})
    const finish = (id: string, param?: any) => {
        if(id in processes.value){
            const pr = processes.value[id]
            if(pr)pr(param)
        }
    }
    const Process = () => {
        const nId = v7()

        const p = new Promise((resolve, reject) => {
            processes.value[nId] = resolve
        })
        return {
            promise: p,
            id: nId
        }
    }
    return {
        Process,
        finish,
        processes
    }
}