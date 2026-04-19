import { defineStore } from 'pinia'
import { type Reactive, reactive, type Ref } from 'vue'


export const useModalStore = defineStore('modales',() => {
    const modales: Reactive<{[k: string]: boolean}> = reactive({
        nuevoAnimal: false,
        nuevoTransito: false,
        vacunacion: false,
        adopcion: false
    });
    const context: Reactive<{ [k in keyof typeof modales]?: any }> = reactive({

    })
    const abrir = <T>(name: string, c?: Ref<T>) => {
        Object.keys(modales).forEach((k) => {
            modales[k] = false
        })
        if (name in modales) {
            modales[name] = true
            if(c) context[name] = c
        }
    }
    const cerrar = (name: string) => {
        modales[name] = false
    }
    return {
        context,
        modales,
        abrir,
        cerrar
    }
})