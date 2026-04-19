export type Maybe<T> = T | null;
export interface MessageResponse<T> {
    ok: boolean,
    message: string,
    data: T
}