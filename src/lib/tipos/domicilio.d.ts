export interface IDomicilio {
    direccion: Maybe<string>,
    altura?: Maybe<string>
    no_tiene_altura: boolean,
    localidad: Maybe<string>,
    provincia: Maybe<string>
}