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
    imagen_url: Maybe<string>,
    observaciones: Maybe<string>
    raza: Maybe<string>
    sexo: string
}