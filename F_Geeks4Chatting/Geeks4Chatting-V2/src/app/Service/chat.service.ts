import { Injectable } from '@angular/core';
import { User } from '../Model/user.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  selectedUser: User | null = null;

  setSelectedChat(chatName: User): void {
    this.selectedUser = (chatName);
  }

  
}
