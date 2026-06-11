import type { IMascota } from '@/lib/tipos/mascotas'
import type { User } from '@/lib/tipos/usuarios'
import type { ITransito } from '@/lib/tipos/transito'
import type { Maybe } from '@/lib/tipos/generics'
import type { Reporte } from '@/lib/tipos/reportes'

export interface DetalleAdopcion {
    adopcion: IAdopcion,
    animal: IMascota,
    usuario: User,
    reportes: Reporte[]
}
export interface IAdopcion {
    id_adopcion: string,
    id_animal: string,
    id_usuario_voluntario: string,
    fecha_inicio: string,
    fecha_fin: Maybe<string>
}

export interface DetalleAdopcion {
    adopcion: IAdopcion,
    animal: IMascota,
    usuario: User,
    reportes: {}[]
}


