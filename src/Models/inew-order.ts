export interface InewOrder {
    clientName:string,//1
    status:string,//2
    totalPrice:number,//3
    totalWeight:number,//4
    phoneOne:string,//5
    phoneTwo:string,//6
    email:string,//7
    notes:string,//8
    streetAndVillage:string,//9
    ifVillage:boolean,
    merchantID:number,//10
    shippingTypeID:number,//11
    paymentTypeID:number,//12
    governmentId:number,//13
    deliveryTypeID:number,//14
    cityID:number,
    products: Array<{//15
        name: string;
        price: number;
        weight: number;
        quantity: number;
      }>
}
