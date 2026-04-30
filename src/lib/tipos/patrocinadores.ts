import type { Maybe } from '@/lib/tipos/generics'

export interface IPatrocinador{
    id_patrocinador: number,
    nombre: string,
    contacto: string,
    email: string,
    descripcion: string,
    fecha_alta: string
}
