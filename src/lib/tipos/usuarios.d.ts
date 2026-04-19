import type { Maybe } from '@/lib/tipos/generics'

export interface User {
    apellido: string,
    cuit: string
    direccion: string
    email: string
    fecha_alta: string
    fecha_modificacion: string
    id_refugio: Maybe<number>
    id_usuario: string
    nombre: string
    password_hash: string
    telefono: string
}