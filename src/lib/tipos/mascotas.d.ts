import type { Maybe } from '@/lib/tipos/generics'
import type { ISolicitud } from '@/components/solicitud/Solicitud.vue'
import type { IDatosSolicitud } from '@/components/adopcion/FormAdopcion.vue'

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
    sexo: string,
    transito: Maybe<number>,
    adopcion: Maybe<number>,
    solicitud: Maybe<IDatosSolicitud>
}

export interface IMascotaTransito extends IMascota{
    tipo: ('adopcion'|'transito'),
    id_vinculo: number
}

export interface HistorialAnimal {
    id: string,
    fecha_desde: string,
    fecha_hasta: Maybe<string>,
    tipo: ('transito' | 'adopcion' | 'refugio')
}