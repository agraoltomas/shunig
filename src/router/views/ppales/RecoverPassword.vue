<script setup lang="ts">

import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import { useRoute } from 'vue-router'
import { onMounted, type Ref, ref } from 'vue'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import Label from '@/components/forms/Label.vue'
import { useAxios } from '@/lib/axios.ts'
const route = useRoute()

const mail: Ref<Maybe<string>> = ref(null)
const axiosSerice = useAxios();
const sent = ref(false)
onMounted(() => {
    if(route.query.u){
        mail.value = route.query.u.toString()
    }
})

const enviar = async () => {
    if(!mail.value)return;
    try{
        const r = await axiosSerice.axios.value.post("/auth/resetearPassword",{
            email: mail.value
        });
        const response: MessageResponse<any> = await r.data;
        sent.value = true
    }catch(e) {
    }

}
</script>

<template>
    <Panel class="w-96 m-auto">
        <FormRow>
            <FormCol :span="12">
                <Label class="text-3xl!">Recuperación de clave</Label>
                <InputText size="large" v-model="mail"></InputText>
                <Button @click="enviar"
                    :disabled="!mail || sent" :label=" sent ? 'Mail de recuperación enviado':'Enviar mail de recuperación'" :icon="sent ? 'pi pi-check' : ''"></Button>
            </FormCol>
        </FormRow>
    </Panel>
</template>

<style scoped>

</style>