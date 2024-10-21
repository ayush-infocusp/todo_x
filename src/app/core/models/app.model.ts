export interface todoItems {
    id?: number,
    task: string,
    status: string,
    userId?: string,
    type ?:string
}


export interface userItems {
    email : string,
    id : number,
    role : string,
    username : string
}

export interface apiResponse<T> {
    message_code: string,
    message: string,
    data: T
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
    username: string,
    role: string
}

export interface signupResponse {
    token: string,
    user: userDetails
}