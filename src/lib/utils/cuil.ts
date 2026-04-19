export const CUILValidator = (cuil: string) => {
    console.log(cuil)
    if (!cuil) return true
    if (isNaN(parseInt(cuil))) return false

    const cuilStr = cuil.toString()
    if (cuilStr.length != 11) return false
    const prefijo = cuilStr.substring(0, 2)
    if (!['20', '23', '24', '27'].includes(prefijo)) return false
    const coeficiente = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
    let suma = 0
    const cuilA = cuilStr.split('')
    for (let i = 0; i < 10; i++) {
        // @ts-ignore
        suma += parseInt(cuilA[i]) * coeficiente[i]
    }
    const resto = suma % 11
    let aux = 11 - resto
    if (aux == 11) aux = 0
    if (aux == 10) aux = 9
    return cuilA[10] == aux.toString()
}
