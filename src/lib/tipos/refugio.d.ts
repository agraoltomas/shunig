import type { IDomicilio } from '@/lib/tipos/domicilio'

export interface IRefugio {
    administrador: string,
    capacidad_total: number,
    cuit: string,
    domicilio: Maybe<IDomicilio>,
    email: string,
    estado_activo: boolean,
    fecha_alta: string,
    fecha_modificacion: Maybe<string>,
    id_refugio: number,
    nombre: string,
    telefono: string,
    id_usuario_adm: string,
    nombre_responsable: string
}