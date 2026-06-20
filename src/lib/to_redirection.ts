import { useRoute, useRouter } from 'vue-router'
import { ref, type Ref, watch } from 'vue'
import type { Maybe } from '@/lib/tipos/generics'


export const useToRedirection = () => {
    const router = useRouter();
    const route = useRoute()
    const to: Ref<Maybe<string>> = ref(null)
    const parseRoute = () => {
        console.log(route.query.to)
        if (route.query.to) {
            const resolve = router.resolve(decodeURIComponent(route.query.to))
            console.log(resolve)
            if (resolve) {
                to.value = resolve.fullPath
                console.log(resolve.fullPath)
            }
        }
    }
    watch(() => route.query.to, () => {
        parseRoute()
    })
    return {
        to,
        parseRoute,
    }
}