export const LOCAL_STORAGE = {
    AUTH_TOKEN: 'authToken',
    USER_INFO: 'userInfo'
}

export const STATUS = {
    COMPLETED: 'COMPLETED',
    PENDING: 'PENDING'
}

export const FILTERS = {
    ALL: 'ALL',
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED'
}

export const FILTER_ARRAY = [
    FILTERS.ALL,
    FILTERS.PENDING,
    FILTERS.COMPLETED
]

export const USER = {
    ADMIN: "ADMIN",
    CLEINT: "CLIENT"
}
export const USER_FILTER = {
    ACTIVE: { key: 'Active', delete: false },
    IN_ACTIVE: { key: 'InActive', delete: true }
}
export const USER_FILTER_ARRAY = [
    USER_FILTER.ACTIVE,
    USER_FILTER.IN_ACTIVE
]


export const FILE_TYPE = {
    AUDIO : 'AUDIO',
    VIDEO : 'VIDEO',
    TEXT : 'TEXT'
}