import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBranch } from '../Models/i-branch';
import { environment } from '../environments/environment.development';
import { IcityID } from '../Models/icity-id';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private httpClient:HttpClient) { }

   GetAllCities() {
    return this.httpClient.get(`${environment.apiUrl}City`);
  }
  GetByID(id:number) :Observable<any>{ // edite api
    return this.httpClient.get(`${environment.apiUrl}City/${id}` );

  }
  AddCity(cityObj:IcityID):Observable<any>{ 
    cityObj.normalShippingCost=1;
    cityObj.pickupShippingCost=10;
    cityObj.governmentID=1;
    return this.httpClient.post<string>(`${environment.apiUrl}City`,cityObj);
    // return this.httpClient.post<string>(`${this.apiURl}`/AddBranch/$`{Name}`,null);

  }

  DeleteCity(id:number):Observable<any> {
    return this.httpClient.delete<any>(`${environment.apiUrl}City/${id}` );
  }

  UpdateCity(id: number, CityObj:IcityID): Observable<any> {  //Ihave a problem here 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // const body = JSON.stringify(branchObj);
    console.log(id)
    console.log(CityObj)
    return this.httpClient.put(`${environment.apiUrl}City/${id}`, CityObj,{headers});
    // return this.httpClient.put(`https://localhost:7270/api/Branch/UpdateBranch/${id}`, body,{headers});
  }
  ChangeStatus(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}City/changeStatus/${id}`);
  }

}
