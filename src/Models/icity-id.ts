export interface IcityID {
    id: number,
    name: string,
    governmentID: number,
    governmentName?:string,
    normalShippingCost: number,//create input for this
  pickupShippingCost: number,//create input for this 
    status:boolean
}
