import { defineStore } from 'pinia'
import { type Reactive, reactive, type Ref } from 'vue'
import type { IMascota } from '@/lib/tipos/mascotas'
import type { Maybe } from '@/lib/tipos/generics'
import type { User } from '@/lib/tipos/usuarios'

export interface IModalesContext {
    adopcion: Maybe<{ mascota: Maybe<IMascota>, usuario: Maybe<User> }>,
    nuevoAnimal: any,
    nuevoTransito: Maybe<{ mascota: Maybe<IMascota>, usuario: Maybe<User> }>,
    vacunacion: any,
    nuevoPatrocinador: any
    eliminar: any,
    reporte: Maybe<IMascota>,
    mostrarAnimal: Maybe<IMascota>,
}
export const useModalStore = defineStore('modales',() => {
    const modales: Reactive<{[k: string]: boolean}> = reactive({
        nuevoAnimal: false,
        nuevoTransito: false,
        vacunacion: false,
        adopcion: false,
        nuevoPatrocinador: false,
        eliminar: false,
        reporte: false,
        mostrarAnimal: false,
    });
    const context: Reactive<IModalesContext> = reactive({
        adopcion: null, nuevoTransito: null,
        nuevoAnimal: null, vacunacion: null, nuevoPatrocinador: null, eliminar: null,
        reporte: null, mostrarAnimal: null
    })
    const abrir = < K extends keyof IModalesContext>(name: K, c?: IModalesContext[K]) => {
        console.log(name, c)
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