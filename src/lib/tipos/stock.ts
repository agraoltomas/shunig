import type { Maybe } from '@/lib/tipos/generics'

export interface IStock{
    id_stock: number,
    codigo_articulo: string,
    marca: string,
    fecha_creacion: string,
    cantidad: number,
    fecha_vencimiento: string,
    id_producto: number,
    id_origen_stock: number,
    origen_stock: string,
    id_donacion: Maybe<number>,
    fecha_modificacion: string,
    descripcion: string,
    id_unidad_stock: number,
    fecha_donacion: Maybe<string>,
    fecha_recepcion: Maybe<string>,
    donacion_patrocinador: Maybe<string>
}

