import type { Maybe } from '@/lib/tipos/generics'

export interface IDonacionPatrocinador {
    id_solicitud_donacion: number,
    fecha_solicitud: string,
    fecha_confirmacion: Maybe<string>,
    id_estado_solicitud: number,
    estado_solicitud: string,
    id_producto: number,
    codigo_producto: string,
    producto: string,
    id_donacion: Maybe<number>,
    fecha_donacion: Maybe<string>,
    fecha_recepcion: Maybe<string>
}