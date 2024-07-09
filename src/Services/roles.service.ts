import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  apiURl:string="https://localhost:7270/api/Role"

  constructor(private httpClient:HttpClient) { }

   GetAllRoles() {
    return this.httpClient.get(`${this.apiURl}/allRoles`);
  }
  AddRole(Name:string):Observable<any>{
    return this.httpClient.post<string>(`${this.apiURl}/AddRole/${Name}`,null);

  }

  DeleteRole(id:number):Observable<any> {
    return this.httpClient.delete<any>(`${this.apiURl}/deleteRole/${id}` );
  }

  GetByID(id:number) :Observable<any>{
    return this.httpClient.get(`${this.apiURl}/GetRole/${id}` );

  }
  UpdateRole(id: number, roleName: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(roleName);
    console.log(id)
    return this.httpClient.put(`https://localhost:7270/api/Role/UpdateRole/${id}`, body,{headers});
  }
  GetPermissions(id: number): Observable<any> {
    return this.httpClient.get(`${this.apiURl}/GetRolePermissions/${id}`);
  }

  UpdateRolePermissions(id: number, permissions: any[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(permissions);
    console.log(body)
    return this.httpClient.put(`${this.apiURl}/UpdateRolePermissions/${id}`, permissions,{headers});
  }



}
