export interface todoItems {
    id ?: number,
    data: string,
    status: string,
    userId ?: string,
}

export interface apiResponse<T> {
    mc: string,
    m: string,
    dt: T
}