<script setup lang="ts">
import { type Ref, ref } from 'vue'
const tab = ref(0)
const usuario: Ref<string | null> = ref(null)
const password: Ref<string | null> = ref(null)
</script>

<template>
  <div class="w-96 m-auto rounded-lg border pt-5 pb-3">
    <Tabs :value="tab" class="rounded-lg">
      <TabList pt:tabList="!border-b-0" pt:activeBar="!w-[0px]">
        <Tab class="border! rounded-lg" :value="0">Voluntario</Tab>
        <Tab class="border! rounded-lg" :value="1">Refugio</Tab>
      </TabList>
      <TabPanels>
        <TabPanel :value="0">
          <div class="flex flex-col max-w-fit m-auto p-3 gap-3">
            <div class="text-xl font-semibold px-2 py-3 m-auto">Ingresar</div>
            <InputText placeholder="CUIL" v-model="usuario"></InputText>
            <Password placeholder="Contraseña" v-model="password"></Password>
            <Button label="Ingresar"></Button>
            <RouterLink to="/register" class="link my-3 text-primary-400"
              >¿No tenés Cuenta? Registrate</RouterLink
            >
          </div>
        </TabPanel>
        <TabPanel :value="1">
          <div class="flex flex-col max-w-fit m-auto p-3 gap-3">
            <div class="text-xl font-semibold px-2 py-3 m-auto">Ingresar</div>
            <InputText placeholder="CUIL" v-model="usuario" fluid></InputText>
            <Password placeholder="Contraseña" v-model="password" fluid></Password>
            <Button label="Ingresar"></Button>
            <RouterLink to="/register" class="link my-3 text-primary-400"
              >¿No tenés Cuenta? Registrar Refugio</RouterLink
            >
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped></style>
