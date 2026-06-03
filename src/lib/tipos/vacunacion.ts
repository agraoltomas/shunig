import type { Maybe } from '@/lib/tipos/generics'
import type { IDomicilio } from '@/lib/tipos/domicilio'

export interface IEventoVacunacion{
    fecha_evento: string
    id_refugio: number
    descripcion: string
    vacuna_tipo: number
    vacuna: string
    cupo_maximo: number
    observaciones: Maybe<string>,
    refugio_nombre: string
    refugio_domicilio: IDomicilio,
    inscriptos: string
}
