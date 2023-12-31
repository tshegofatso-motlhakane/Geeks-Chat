import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User, createUser } from '../Model/user.model';
import { Observable } from 'rxjs/internal/Observable';
import { ResponseObject } from '../Model/message.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

 
  private baseUrl = 'http://localhost:8080/api/auth';
  private response!: ResponseObject<any> ;
  private isAuth = false;


  constructor(private http: HttpClient) { }


  registerUser(newuser : createUser): Observable<ResponseObject<any>> {
    return this.http.post<ResponseObject<any>>(`${this.baseUrl}/register`, newuser);
  }

  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post<ResponseObject<any>>(`${this.baseUrl}/login`, loginData);
  }

  logout(): boolean {
    sessionStorage.clear();
    return true;
  }

  isAuthenticated(): boolean {

    return this.isAuth;
  }
}
