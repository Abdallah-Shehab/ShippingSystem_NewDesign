import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';
import { environment } from '../environments/environment.development';
import { InewOrder } from '../Models/inew-order';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {
  
  constructor(private http:HttpClient) { 
    
  }
token :any = '';
  header = new HttpHeaders({
  'Authorization': `Bearer ${this.token}`
})
  getAllGovernmentTocreateOrder():Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}Government`);
  }

  getAllCitiesBasedOnGovernments( id:number):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}City/ByGovernment?id=${id}`)
  }
  getAllShippingType():Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}ShippingType`)
  }
  getAllPaymentType( ):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}Payment`)
  }
  getAllBranch( ):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}Branch`)
  }

  getAllOrders(){
   return this.http.get(`${environment.apiUrl}Orders`);
  }

  getAllOrdersForMercahnt(id:number){
    return this.http.get(`${environment.apiUrl}Orders/AllOrdersForMerchant?MerchantId=${id}`);
   }

   getAllOrdersForDelivery(id:number){
    return this.http.get(`${environment.apiUrl}Orders/AllOrdersForDelivery?DeliveryId=${id}`);
   }
  deleteOrder(id:number){
    return this.http.delete(`${environment.apiUrl}orders/${id}`);
  }

  getExistedOrderStatuses(){
    return this.http.get(`${environment.apiUrl}Orders/OrdersCount?merchantId=0`);
  }
  getAllOrderStatuses(){
    return this.http.get(`${environment.apiUrl}Orders/OrderStatuses`);
  }
  
  updateOrderStatus(id:number, status:string){
 
    return this.http.put(`${environment.apiUrl}Orders/UpdateStatus/${id}?status=${status}`,null);
  }  
  AssignDelivery(orderid:number, deliveryId:number){
    
    // https://localhost:7270/api/Orders/AssignOrderToDelivery?orderId=1&deliveryId=1

    return this.http.put(`${environment.apiUrl}Orders/AssignOrderToDelivery?orderId=${orderid}&deliveryId=${deliveryId}`,null);
  }
  createOrder(order:InewOrder){
    return this.http.post(`https://localhost:7270/api/Orders`,order);
  }
  getAllDeliveryTypes():Observable<any>{
    return this.http.get(`${environment.apiUrl}DeliveryType`);
  }
}
