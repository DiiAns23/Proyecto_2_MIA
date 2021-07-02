export interface UserInterface {
    iduser: number,
    name: string,
    username: string,
    image: string,
    password: string
}
export interface Publications {
    id:number,
    text: string,
    idUser:number,
    image:string
}

export interface Filter {
    idtag: number,
    idpublication: number,
    tag: string
}

export interface Friends{
    id:number,
    name: string
}

export interface GetSetFR{
    iduser: number,
    iduser2: number
}