import { ref, type Ref, useTemplateRef } from 'vue'
import { useModalStore } from '@/stores/modales.ts'
import moment from 'moment'
import type { Maybe } from '@/lib/tipos/generics'

export interface EventoResumen {
    cupo: number,
    evento: string,
    fecha: string,
    refugio: string,
    vacuna: string
}

export interface ChatButton {
    action: () => void,
    label: string
}

export interface BasicMessage {
    content: string,
    role: ('chat' | 'user'),
    time: Moment,
    type: ('message' | 'content'),
    mascotas?: any[]
    vacunas?: any[]
    botones?: ChatButton[]
}

export interface TextMessage extends BasicMessage {
    type: 'message'
}

export interface MascotaMessage extends BasicMessage {
    type: 'content',
    mascotas: IMascota[]
}

export interface VacunaMessage extends BasicMessage {
    type: 'content',
    vacunas: EventoResumen[]
}

export interface ButtonMessage extends BasicMessage {
    botones: ChatButton[]
}

export interface ChatResponse {
    modulo: ('interaccion_basica' | 'mascotas' | 'vacunacion' | 'solicitudes_adopcion'),
    message: string,
    results: Maybe<(IMascota | EventoResumen)[]>
}

export type Message = TextMessage | MascotaMessage | VacunaMessage | ButtonMessage
