export interface IRefugio {
    administrador: string,
    capacidad_total: number,
    cuit: string,
    direccion: string,
    email: string,
    estado_activo: boolean,
    fecha_alta: string,
    fecha_modificacion: Maybe<string>,
    id_refugio: number,
    nombre: string,
    telefono: string
}