import moment from 'moment'

export const dayDiff = (f: string) => {
    return moment(f).diff(moment(), 'days')
}