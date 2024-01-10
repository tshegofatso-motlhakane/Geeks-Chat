import { Injectable } from '@angular/core';
import { User, UserProfile } from '../Model/user.model';
import { HttpClient } from '@angular/common/http';
import { ResponseObject } from '../Model/message.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http : HttpClient,
    private authService : AuthService) { }
  private baseUrl = 'http://localhost:8080/api/user'
  selectedUser: UserProfile | null = null;

  setSelectedChat(chatName: UserProfile): void {
    this.selectedUser = (chatName);
  }

  updateUserInfo(user : UserProfile){
    const userId = this.authService.getCurrentUser();
    console.log("Updating " + userId);
    const addContactUrl = `${this.baseUrl}/${userId}/update`;
  
    this.http.put<ResponseObject<any>>(addContactUrl, user).subscribe(
      (response) => {
        console.log(response.message);
      },
      (error) => {
        console.error('Error adding contact:', error);
      }
    );
  }

  
}
