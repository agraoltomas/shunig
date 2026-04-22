import * as yup from "yup"
import type { IDomicilio } from '@/lib/tipos/domicilio'
export const domicilioSchema = yup.object().shape({
    direccion: yup.string().required("Ingrese una direccion"),
    no_tiene_altura: yup.boolean().default(false),
    codigo_postal: yup.string().required("Ingrese un codigo postal"),
    localidad: yup.string().required("Ingrese un localidad"),
    ciudad: yup.string().required("Ingrese un ciudad"),
    provincia: yup.string().required("Ingrese un provincia")
} satisfies {[k in keyof IDomicilio]: any})