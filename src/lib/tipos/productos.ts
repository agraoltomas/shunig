import type { Maybe } from '@/lib/tipos/generics'

export interface IProducto{
    id_producto: number,
    codigo_producto: string,
    nombre: string,
    fecha_alta: string,
    id_tipo_producto: number,
    tipo_producto: string,
    id_refugio: number,
    descripcion: string,
    cantidad: Maybe<number>,
    fecha_modificacion: Maybe<string>,
    id_unidad_stock: Maybe<number>,
    unidad_stock: Maybe<string>,
    medida: Maybe<string>,
    cantidad_alerta_baja: Maybe<number>,
    cantidad_alerta_moderada: Maybe<number>,
    alerta_stock_activa: boolean
}

