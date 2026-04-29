import type { Maybe } from '@/lib/tipos/generics'
import type { IDomicilio } from '@/lib/tipos/domicilio'
import type { Rol } from '@/lib/tipos/roles'

export interface User {
    apellido: string,
    cuit: string
    domicilio: IDomicilio,
    email: string
    fecha_alta: string
    fecha_modificacion: string
    id_refugio: Maybe<number>
    id_usuario: string
    nombre: string
    password_hash: string
    telefono: string,
    roles: Rol[]
}