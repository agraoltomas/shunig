import { ref, type Ref } from 'vue'
import type { Maybe } from '@/lib/tipos/generics'
import { useJWTToken } from '@/lib/token.ts'
type MessageListener = (ws: WebSocket, event: MessageEvent<any>) => void
export const useWebsocket = (url: string) => {
    const ws: Ref<Maybe<WebSocket>> = ref(null) // WebSocket connection
    const isConnected = ref(false) // Connection status
    const retryInterval = 3000 // Time interval for retrying connection (ms)
    let retryTimeout: Maybe<number> = null // Timeout reference for reconnection
    const onMessage: Ref<MessageListener[]> = ref([])
    const connectWebSocket = () => {
        const { getToken } = useJWTToken()
        ws.value = new WebSocket(`ws://${url}`, getToken() ?? '?')
        ws.value.onopen = () => {
            console.log('WebSocket connected.')
            isConnected.value = true
            if (retryTimeout) {
                clearTimeout(retryTimeout) // Clear the retry timeout on successful connection
                retryTimeout = null
            }
        }

        ws.value.onmessage = (ev) => {
            onMessage.value.forEach((fn) => {
                fn(ws.value!, ev)
            })
        }

        ws.value.onerror = (error) => {
            console.error('WebSocket error:', error)
            isConnected.value = false
        }

        ws.value.onclose = () => {
            console.log('WebSocket closed. Retrying...')
            isConnected.value = false
            attemptReconnect() // Trigger reconnection process when the connection closes
        }
    }

    const attemptReconnect = () => {
        if (!isConnected.value) {
            retryTimeout = setTimeout(() => {
                console.log('Attempting to reconnect...')
                connectWebSocket()
            }, retryInterval)
        }
    }
    const addOnMessageListener = (fn: MessageListener ) => {
        onMessage.value.push(fn)
    }
    connectWebSocket()
    return {
        connectWebSocket,
        attemptReconnect,
        ws,
        isConnected,
        retryInterval,
        retryTimeout,
        addOnMessageListener
    }

}