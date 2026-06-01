import { defineStore } from 'pinia'
import { useAxios } from '@/lib/axios.ts'
import { rutas_api } from '@/rutas_api.ts'


const usuarioStore = defineStore('usuario',() => {

    const getUsuario = (id: string|number) => {
        const { axios} = useAxios()
        try {
            const r = axios.value.get(rutas_api.usuario.GET({ id_usuario: id }));

        }catch(err) {

        }


    }

    return {

    }
})