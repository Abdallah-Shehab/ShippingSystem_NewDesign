import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IGovernment } from '../Models/i-government';

@Injectable({
  providedIn: 'root'
})
export class GovernmentsService {
  apiURl:string="https://localhost:7270/api/Government"

  constructor(private httpClient:HttpClient) { }

   GetAllGovernments() {
    return this.httpClient.get(`${this.apiURl}`);
  }
   GetAllGovernmentsNoBranches() {
    return this.httpClient.get(`${this.apiURl}/NoBranch`);
  }
  GetByID(id:number) :Observable<any>{
    return this.httpClient.get(`${this.apiURl}/${id}` );

  }
  AddGovernment(governmentObj:IGovernment):Observable<any>{
    return this.httpClient.post<string>(`${this.apiURl}`,governmentObj);
    // return this.httpClient.post<string>(`${this.apiURl}`/AddGovernment/$`{Name}`,null);

  }

  DeleteGovernment(id:number):Observable<any> {
    return this.httpClient.delete<any>(`${this.apiURl}/${id}` );
  }

  UpdateGovernment(id: number, governmentObj:IGovernment): Observable<any> {  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // const body = JSON.stringify(GovernmentObj);
    console.log(id)
    console.log(governmentObj)
    return this.httpClient.put(`${this.apiURl}/${id}`, governmentObj,{headers});
    // return this.httpClient.put(`https://localhost:7270/api/Government/UpdateGovernment/${id}`, body,{headers});
  }
  ChangeStatus(id: number): Observable<any> {
    return this.httpClient.get(`${this.apiURl}/changeStatus/${id}`);
  }

}
