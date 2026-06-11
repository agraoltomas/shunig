import type { Maybe } from '@/lib/tipos/generics'
import type { User } from '@/lib/tipos/usuarios'
import type { IMascota } from '@/lib/tipos/mascotas'
import type { Reporte } from '@/lib/tipos/reportes'

export interface ITransito {
    id_transito: string,
    id_animal: string,
    id_usuario_voluntario: string,
    fecha_inicio: string,
    fecha_fin: Maybe<string>
}

export interface DetalleTransito {
    transito: ITransito,
    animal: IMascota,
    usuario: User,
    reportes: Reporte[]
}


