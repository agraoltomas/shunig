import type { Maybe } from '@/lib/tipos/generics'
import type { IDomicilio } from '@/lib/tipos/domicilio'

export interface IEventoVacunacion {
    id_evento_vacunacion: string
    fecha_evento: string
    id_refugio: number
    descripcion: string
    vacuna_tipo: number
    vacuna: string
    cupo_maximo: number
    observaciones: Maybe<string>,
    refugio_nombre: string
    refugio_domicilio: IDomicilio,
    inscriptos: string,
    rango_horario: string,
    veterinario_responsable: Maybe<string>
}

export interface IVacuna {
    id_vacunacion: string,
    id_tipo_vacuna: string,
    id_animal: string,
    veterinario: string,
    observaciones: string,
    id_evento_vacunacion: string,
    fecha_vacunacion: string,
    vacuna: string
}