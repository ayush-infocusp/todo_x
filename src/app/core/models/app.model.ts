export interface todoItems {
    data: string,
    status: string
}

export interface apiResponse<T> {
    mc: string,
    m: string,
    dt: T
}