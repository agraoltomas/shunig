import type { IDomicilio } from '@/lib/tipos/domicilio'

export const toText = (d?: IDomicilio): string => {
    return d ? `${d.direccion}, ${d.localidad}, ${d.provincia}` : ""
}
export const short =(d?: IDomicilio): string  => {
    return d? `${d.direccion}, ${d.localidad}` : ""
}
export default {
    toText,
    short
}