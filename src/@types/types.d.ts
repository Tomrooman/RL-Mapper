export interface dataType {
    status: boolean,
    map: {
        default: {
            path: string,
            name: string
        },
        workshop: {
            path: string,
            active: false | string
        }
    }
}

export interface filesType {
    name: string,
    thumbnail: false | string
}

export interface notifType {
    status: boolean,
    type: string,
    map: string
}