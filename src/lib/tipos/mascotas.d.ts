import type { Maybe } from '@/lib/tipos/generics'

export interface IMascota{
    nombre: string,
    edad: number,
    es_castrado: boolean,
    especie: string,
    fecha_ingreso: string
    fecha_modificacion: Maybe<string>
    id_animal: string,
    id_especie: number,
    id_sexo: number,
    imagen: Maybe<string>,
    observaciones: Maybe<string>
    raza: Maybe<string>
    sexo: string
}

export interface IMascotaTransito extends IMascota{
    tipo: ('adopcion'|'transito'),
    id_vinculo: number
}