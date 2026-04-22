<script setup lang="ts">

import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, type Ref, ref } from 'vue'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import Label from '@/components/forms/Label.vue'
import { useAxios } from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'

const route = useRoute()
const toast = useToast()
const router = useRouter()
const token: Ref<Maybe<string>> = ref(null)
const axiosSerice = useAxios()
const newPassword = ref(null)
const confirmPassword = ref(null)
onMounted(() => {
    if (route.query.t) {
        token.value = route.query.t.toString()
    }
})

const cambiar = async () => {
    if (!token.value) return

    try {
        const r = await axiosSerice.axios.value.post(`/auth/resetearPassword/${token.value}/`, {
            password: newPassword.value
        })
        const response: MessageResponse<any> = await r.data
        if(response.ok){
            toast.add({ summary: response.message, severity: "success" })
            setTimeout(() => {
                router.push('/login')
            },5000)
        }
    } catch (e) {
    }
}
const noCoinciden = computed(() => {
    return (newPassword.value && confirmPassword.value) && (newPassword.value != confirmPassword.value)
})
</script>

<template>
    <Panel class="w-96 m-auto ">
        <div class="gap-3! flex flex-col">
            <FormRow>
                <FormCol :span="12">
                    <Label class="text-3xl!">Nueva contraseña</Label>
                    <Password fluid size="large" v-model="newPassword"></Password>
                    <Message v-if="noCoinciden"
                             severity="error">
                        Las contraseñas no coinciden
                    </Message>
                </FormCol>
            </FormRow>
            <FormRow>
                <FormCol :span="12">
                    <Label class="text-3xl!">Confirme contraseña</Label>
                    <Password fluid :feedback="false" size="large" v-model="confirmPassword"></Password>
                </FormCol>
            </FormRow>
            <FormRow>
                <FormCol :span="12">
                    <Button size="large" @click="cambiar"
                            :disabled="!(newPassword && confirmPassword)" label="Cambiar"></Button>
                </FormCol>
            </FormRow>
        </div>
    </Panel>
</template>

<style scoped>

</style>