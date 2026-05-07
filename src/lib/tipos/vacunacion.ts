import type { Maybe } from '@/lib/tipos/generics'

export interface IEventoVacunacion{
    fecha_evento: string
    id_refugio: number
    descripcion: string
    vacuna_tipo: number
    cupo_maximo: number
    observaciones: Maybe<string>
}
