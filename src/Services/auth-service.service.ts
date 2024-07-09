import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode'; // Import jwt_decode correctly
import { ILogin } from '../Models/i-login';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http:HttpClient) { }

 
  
  login(createLoginDTO:ILogin,role:string): Observable<string> {
    return this.http.post<string>(`https://localhost:7270/api/Login/${role}`,createLoginDTO, { responseType: 'text' as 'json' });
  }
  
 

  getDecodedToken() {
    const encodedToken = localStorage.getItem('token');
    if (encodedToken) {
      return jwtDecode(encodedToken); // Correct usage
    }
    return null;
  }

  getToken(): string | null{
    return localStorage.getItem('token');
  }

  get getheader():HttpHeaders{
    return new HttpHeaders({
      'Content-Type': 'application/json' ,
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
  }
}
