import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User, UserProfile, createUser } from '../Model/user.model';
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

  login(username: string, password: string): Observable<ResponseObject<any>> {
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

 

  setCurrentUserInfo(response : any) {

    const user: UserProfile = {
      userid : response.data.userid,
      firstname: response.data.firstname || '',  // If response.data.firstname is null or undefined, use an empty string
      lastname: response.data.lastname || '',
      email: response.data.email || '',
      username: response.data.username || '',
      avatar: response.data.avatar || '',
      bio: response.data.bio || ''
    };
    sessionStorage.setItem("currentUser",JSON.stringify(user));

  }

  getCurrentUserInfo(): UserProfile | null{
    const currentUserString = sessionStorage.getItem('currentUser');


    if (currentUserString) {
     
      let currentUser: UserProfile = JSON.parse(currentUserString);
      return currentUser;
    }

   return null;
     // or any other default value if user is not found
  }
}
