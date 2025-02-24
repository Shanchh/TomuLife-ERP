export interface User {
    _id: string,
    email: string,
    nickname: string,
    role: string,
    createAt: number,
}

export interface Role {
    _id: string,
    color: string,
    createAt: number,
    creator: {
        _id: string,
        nickname: string,
        email: string,
    },
    level: number,
    name: string,
    tag: string,
}