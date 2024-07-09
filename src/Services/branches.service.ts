import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBranch } from '../Models/i-branch';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class BranchesService {

  apiURl:string="https://localhost:7270/api/Branch"

  constructor(private httpClient:HttpClient,private authService:AuthServiceService) { }

   GetAllBranches() {
    return this.httpClient.get(`${this.apiURl}`,{headers:this.authService.getheader});
  }
  GetByID(id:number) :Observable<any>{
    return this.httpClient.get(`${this.apiURl}/${id}` ,{headers:this.authService.getheader});

  }
  AddBranch(branchObj:IBranch):Observable<any>{  //branchName, govID
    return this.httpClient.post<string>(`${this.apiURl}`,branchObj,{headers:this.authService.getheader});
    // return this.httpClient.post<string>(`${this.apiURl}`/AddBranch/$`{Name}`,null);

  }

  DeleteBranch(id:number):Observable<any> {
    return this.httpClient.delete<any>(`${this.apiURl}/${id}` ,{headers:this.authService.getheader});
  }

  UpdateBranch(id: number, branchObj:IBranch): Observable<any> {  //governmentID, name , status
    return this.httpClient.put(`${this.apiURl}/${id}`, branchObj,{headers:this.authService.getheader});
  }
  ChangeStatus(id: number): Observable<any> {
    return this.httpClient.get(`${this.apiURl}/changeStatus/${id}`,{headers:this.authService.getheader});
  }

}
