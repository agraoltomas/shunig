import { type Ref, ref } from 'vue'
import type { Maybe } from '@/lib/tipos/generics'

export const toBase64 = (f: File): Promise<any> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = () => resolve(reader.result);
});

export const useFile = () => {
    const file: Ref<Maybe<File>> = ref(null);
    const asBase64 = async (): Promise<Maybe<string>> => {
        if(!file.value) return null;
        return toBase64(file.value);
    }
    const toURL = (): Maybe<string> => {
        if(!file.value) return null;
        return URL.createObjectURL(file.value)
    }
    const fromString = (s: string) => {
        const f = new File(Array.from(s), "imagen")
        file.value = f
    }
    return {
        file,
        asBase64,
        toURL,
        fromString,
    }
}