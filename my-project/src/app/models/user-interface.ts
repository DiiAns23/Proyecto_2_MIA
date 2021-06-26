export interface UserInterface {
    id: number,
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