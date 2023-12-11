import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { createUser } from '../Model/user.model';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

 
  private baseUrl = 'http://localhost:8080/api/auth';
  private response: any;
  private isAuth = false;


  constructor(private http: HttpClient) { }

  register(newuser: createUser): Observable<any> {


    console.log('Attempting register' + newuser.username);
    this.response = this.http.post(`${this.baseUrl}/register`, newuser);
    

    if (this.response.username != null) {

      this.isAuth = true;
      console.log(this.response.username + " User registred");
    }else{
      console.log("error");
    }

    return this.response;
  }

  login(username: string, password: string): Observable<any> {
    console.log('Attempting login...2' + username + ' ' + password + " to " + this.baseUrl + "/login");
    const loginData = { username, password };
    this.response = this.http.post(`${this.baseUrl}/login`, loginData);

    console.log(this.response)
    if (this.response.username != null) {
      this.isAuth = true;
      console.log(this.response.username + " User Authenticated");
    }

    return this.response;
  }

  logout(): boolean {
    sessionStorage.clear();
    return true;
  }

  isAuthenticated(): boolean {

    return this.isAuth;
  }
}
