import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  apiURl:string="https://localhost:7270/api/Employees"

  constructor(private httpclient:HttpClient) { }

  getAllEmployees(){
    return this.httpclient.get(this.apiURl);

  }  
  
  getEmployee(id:number){
    return this.httpclient.get(`https://localhost:7270/api/Employees/${id}`);
  }

  updateEmployeeStatus( id:number ){
return this.httpclient.put(`${this.apiURl}/UpdateEmpStatus/${id}`,null);
  }
  AddEmployee(Employee:any){
   return this.httpclient.post("https://localhost:7270/api/Employees/add",Employee);
  }

  

  updateEmployee(id:number,Employee:any){
    return this.httpclient.put(`https://localhost:7270/api/Employees/update/${id}`,Employee);
   }

   deleteEmployee(id:number){
    return this.httpclient.delete(`https://localhost:7270/api/Employees/Delete/${id}`);

   }
  GetBranches(){
    return this.httpclient.get("https://localhost:7270/api/Branch");
  } 
  GetGovernorates(){
    return this.httpclient.get("https://localhost:7270/api/Government");
  }

  GetAllRoles() {
    return this.httpclient.get(`https://localhost:7270/api/Role/allRoles`);
  }
}


  


