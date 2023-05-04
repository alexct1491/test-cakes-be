interface Cake{
    name:string,
    id:string,
    image:string,
    price:number,
    available:{date:string,timestamp:number}[],
    description:string,
    ingredients:any[]
}
export interface Database{
    cakes:Cake[]
}

