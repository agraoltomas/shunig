import type { IDomicilio } from '@/lib/tipos/domicilio'
import domicilio from '@/lib/modelos/domicilio.ts'
import { useLocalCache } from '@/lib/utils/local_cache.ts'
import type { Maybe } from '@/lib/tipos/generics'
import { useAuthStore } from '@/stores/auth.ts'
import { useAxios } from '@/lib/axios.ts'
const cache = useLocalCache<number>('distancias')
const { axios } = useAxios()

export const toUnit = (d: number) => {
    let unit = 0
    let unitText ='M'
    d = d / 1000
    unit += 1
    console.log(d)
    switch (unit){
        case 0: unitText = 'M'; break;
        case 1: unitText = 'KM'; break;

    }
    return `~${d.toFixed(0)}${unitText}`
}

export const normalize = async (d: IDomicilio) => {
    const makeParams = {}
    d.direccion
    const r = await axios.value.get('http://ws.usig.buenosaires.gob.ar/geocoder/2.2/geocoding',
      { params: {

          }})
}

export const getDistanceGoogle = async (origen: IDomicilio, destino: IDomicilio) => {

    const origenTxt = domicilio.toText(origen)
    const destinoTxt = domicilio.toText(destino)

    const tryCache = cache.get(`${origenTxt}||${destinoTxt}`)
    if (tryCache) {
        return tryCache
    }else{
        const r = await axios.value.post('https://routes.googleapis.com/directions/v2:computeRoutes', {
              origin: { address: origenTxt },
              destination: { address: destinoTxt },
              travelMode: 'WALK'
          },
          {
              headers: {
                  'Authorization': null,
                  'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_API_KEY,
                  'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration'
              }
          })
        console.log(r)
        if(r.data.routes && r.data.routes.length > 0){
            const distancia = r.data.routes[0].distanceMeters
            cache.add(`${origen}||${destino}`, distancia)
            console.log(distancia)
            return distancia
        }
    }
    return null
}
export const getDistanceTo = async (destino: Maybe<IDomicilio>): Promise<Maybe<number>> => {
    const authStore = useAuthStore()
    if(!destino)return null
    if(!authStore.user)return null
    const origen = authStore.user.domicilio
    const d = await getDistanceGoogle(origen, destino)
    return d ?? null
}