import { onBeforeUnmount, type Ref, ref } from 'vue'
import type { Maybe } from '@/lib/tipos/generics'
type Cache<T> = {[k: string]: T}

export const useLocalCache = <T = string>(key: string) => {
    const getCache = localStorage.getItem(key);
    const cache: Ref<Maybe<Cache<T>>> = ref(null);
    if (getCache) {
        cache.value = JSON.parse(getCache)
    }else{
        cache.value = {}
    }
    console.log(cache.value)
    const add = (cKey: string, value: T) => {
        if(!cache.value)return
        cache.value[cKey] = value
        saveCache()
    }

    const get = (cKey: string) => {
        console.log(cKey)
        if(!cache.value)return null
        return cache.value[cKey] ?? null
    }

    const saveCache = ()  => {
        localStorage.setItem(key, JSON.stringify(cache.value))

    }
    return {
        add,
        get
    }
}