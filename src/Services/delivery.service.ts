import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private _HttpClient:HttpClient ) {}

  private baseUrl = 'https://localhost:7270/api';

  getDeliveryAccounts():Observable<any>{
    return this._HttpClient.get('https://localhost:7270/api/Delivery')
  }


  addDeliveryAccount( DeliveryData:object):Observable<any>{
    return this._HttpClient.post('https://localhost:7270/api/Delivery',DeliveryData)
  }



  // method to get branchs from database 

  getBranches():Observable<any>{
    return this._HttpClient.get('https://localhost:7270/api/Branch')
  }


  // deleteDeliveryAccount(id: number): Observable<any> {
  //   return this._HttpClient.delete(` 'https://localhost:7270/api/Delivery/${id}`);
  // }

  deleteDeliveryAccount(id: number): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/Delivery/${id}`);
  }

  updateDeliveryAccount(id: number, body: any): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/Delivery/${id}`, body);
  }

  getDeliveryAccountById(id: number):Observable<any>{
    return this._HttpClient.get(`${this.baseUrl}/Delivery/${id}`)
  }
  
}

