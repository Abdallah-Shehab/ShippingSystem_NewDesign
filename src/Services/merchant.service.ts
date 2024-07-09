import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  constructor(private _HttpClient: HttpClient) { }
  private baseUrl = 'https://localhost:7270/api';

  getMerchantAccounts(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/Merchant`);
  }

  deleteMerchantAccount(id: number): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/Merchant/${id}`);
  }

  addMerchantAccount(deliveryData: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/Merchant`, deliveryData);
  }

  updateMerchantAccount(id: number, body: any): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/Merchant/${id}`, body);
  }

  getMerchantAccountById(id: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/Merchant/${id}`);
  }

  getSpecialOffer(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/SpecialOffer`);
  }

  getBranches(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/Branch`);
  }

  getCities(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/City`);
  }

  getGovernments(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/Government`);
  }

  addSpecialOffers(specialOffers: any[]) {
    return this._HttpClient.post('https://localhost:7270/api/SpecialOffer', specialOffers);
  }


    // Method to fetch special offers by merchant ID



    getSpecialOffersByMerchantId(merchantId: number): Observable<any> {
      return this._HttpClient.get(`${this.baseUrl}/SpecialOffer/Merchant/${merchantId}/SpecialOffers`);
    }
  
}
