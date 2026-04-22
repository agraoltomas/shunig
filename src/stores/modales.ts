import { defineStore } from 'pinia'
import { type Reactive, reactive, type Ref } from 'vue'
import type { IMascota } from '@/lib/tipos/mascotas'
import type { Maybe } from '@/lib/tipos/generics'

export interface IModalesContext {
    adopcion: Maybe<IMascota>,
    nuevoAnimal: any,
    nuevoTransito: Maybe<IMascota>,
    vacunacion: any
}
export const useModalStore = defineStore('modales',() => {
    const modales: Reactive<{[k: string]: boolean}> = reactive({
        nuevoAnimal: false,
        nuevoTransito: false,
        vacunacion: false,
        adopcion: false
    });
    const context: Reactive<IModalesContext> = reactive({
        adopcion: null, nuevoTransito: null,
        nuevoAnimal: null, vacunacion: null
    })
    const abrir = <T>(name: keyof IModalesContext, c?: T) => {
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