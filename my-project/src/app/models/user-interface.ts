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
    idUser:string,
    image:string
}

export interface Friends{
    id:number,
    name: string
}

export interface GetSetFR{
    iduser: number,
    iduser2: number
}