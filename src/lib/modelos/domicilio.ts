import type { IDomicilio } from '@/lib/tipos/domicilio'

export const toText = (d?: IDomicilio): string => {
    return d ? `${d.direccion}, ${d.codigo_postal},${d.localidad}, ${d.provincia}` : ""
}

export default {
    toText,
}