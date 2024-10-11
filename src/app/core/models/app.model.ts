export interface todoItems {
    id?: number,
    task: string,
    status: string,
    userId?: string,
}

export interface apiResponse<T> {
    mc: string,
    m: string,
    dt: T
}

export interface tokenData {
    token: string
}

export interface loginUserDetails {
    email: string,
    password: string,
    username ?: string
}

export interface userDetails {
    email: string,
    id: number,
    username: string
}

export interface signupResponse {
    token: string,
    user: userDetails
}