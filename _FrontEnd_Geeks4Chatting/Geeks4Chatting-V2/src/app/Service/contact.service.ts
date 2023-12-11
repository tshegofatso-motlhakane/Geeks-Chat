import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Contact, CreateContact, User } from '../Model/user.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MessageService } from './message.service';
import { Message, MessageList } from '../Model/message.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private baseUrl = 'http://localhost:8080/api/contact'

  private messageListSubject = new BehaviorSubject<MessageList[]>([]);
  messageList$ = this.messageListSubject.asObservable();

  contacts : User[] = [];
  
  constructor(private http : HttpClient , private messageService : MessageService) { 
   
  }

  fetchContacts(userId: number): Observable<User[]> {
    const url = `${this.baseUrl}/get/${userId}/all`;
    return this.http.get<User[]>(url).pipe(
      tap((fetchedContacts: User[]) => {
        console.log("Fetched Contacts:"+this.contacts);
        this.contacts = [...fetchedContacts]; // Use spread operator to create a new list
        this.updateList();
      }),
      catchError((error: any) => {
        console.error('Error fetching contacts:', error);
        throw error;
      })
    );
  }

  
  updateLatestMessageForUser(userId: number, updatedMessage: Message) {
    const currentList = this.messageListSubject.getValue();
    console.log('Current List:', currentList);
      let unread: number = 0;
      let conv = this.getconversationid(userId);
      this.messageService.getReceivedMessagesCount(conv).subscribe(unreadCount => {
        unread = unreadCount;
      });
  
    const updatedList = currentList.map(message => {
      if (message.userid === userId) {
        console.log('Updating Message:', message);
        message.lastestText = updatedMessage.content;
        message.timestamp = updatedMessage.timestamp;
        message.unread = unread;
      }
      return message;
    });
  
    console.log('Updated List:', updatedList);
    this.messageListSubject.next(updatedList);
  }

  updateList(): void {
      const updatedMessageList: MessageList[] = this.contacts.map(user => {
      const conversationId = this.getconversationid(user.userid);
      const lastMessageText = this.messageService.getLastMessageText(conversationId);
      let unread: number = 0;
      this.messageService.getReceivedMessagesCount(conversationId).subscribe(unreadCount => {
        unread = unreadCount;
      });
  
      return {
        userid: user.userid,
        username: user.username,
        lastestText: lastMessageText.content,
        timestamp: lastMessageText.timestamp, // You may want to set the actual timestamp
        unread: unread
      };
    });
  
    // Update the BehaviorSubject with the new value
    this.messageListSubject.next(updatedMessageList);
  }

  addNewContactToList(newContact: CreateContact): void {
    const addContactUrl = `${this.baseUrl}/add`;
  
    this.http.post<User[]>(addContactUrl, newContact).subscribe(
      (updatedContacts: User[]) => {
        this.contacts = updatedContacts;
      //  this.messageService.updateList(this.contacts);
  
        const newContact: User = this.contacts[this.contacts.length - 1];
        console.log("New list:", this.contacts);
        this.updateList();
      },
      (error) => {
        console.error('Error adding contact:', error);
      }
    );
  }
  

 
  getCurrentUser(): number {
    const currentUserString = sessionStorage.getItem('currentUser');

    if (currentUserString) {
      const currentUser: User = JSON.parse(currentUserString);
      return currentUser.userid;
    }

    return 0; // or any other default value if user is not found
  }



  getContacts(searchTerm: string): Observable<User[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    const userId = this.getCurrentUser();
    const url = `${this.baseUrl}/${userId}/search`;
    return this.http.get<User[]>(url, { params });
  }

  getconversationid( receiver: number): string{
     const sender = this.getCurrentUser();
    
    if(sender < receiver)
    {
      return sender+"_"+receiver;
    }else
    if(sender > receiver)
    {
      return receiver+"_"+sender;
    }else
    {
      return "ubnormal chatid";
    }

  }
 
}
