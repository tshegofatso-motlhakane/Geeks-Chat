import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CreateContact, User, UserProfile } from '../Model/user.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MessageService } from './message.service';
import { Message, MessageList } from '../Model/message.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private baseUrl = 'http://localhost:8080/api/contact'

  private messageListSubject = new BehaviorSubject<MessageList[]>([]);
  messageList$ = this.messageListSubject.asObservable();

  contacts : UserProfile[] = [];
  
  constructor(private http : HttpClient ,
     private messageService : MessageService,
     private authService: AuthService) { 
   
  }

  fetchContacts(userId: number): Observable<UserProfile[]> {
    const url = `${this.baseUrl}/get/${userId}/all`;
    return this.http.get<UserProfile[]>(url).pipe(
      tap((fetchedContacts: UserProfile[]) => {
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
      unread = this.messageService.countReceivedMessages(conv);
      console.log("ureadin updatelatest : " + unread);
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
      unread = this.messageService.countReceivedMessages(conversationId);
      console.log("uread in updatelist : " + unread);
      return {
        userid: user.userid,
        username: user.username,
        lastestText: lastMessageText.content,
        timestamp: lastMessageText.timestamp, // You may want to set the actual timestamp
        unread: unread,
        avatar : user.avatar
      };
    });
  
    // Update the BehaviorSubject with the new value
    this.messageListSubject.next(updatedMessageList);
  }

  addNewContactToList(newContact: CreateContact): void {
    const addContactUrl = `${this.baseUrl}/add`;
  
    this.http.post<UserProfile[]>(addContactUrl, newContact).subscribe(
      (updatedContacts: UserProfile[]) => {
        console.log("adding ");
        this.contacts = updatedContacts;
        const newContact: UserProfile = this.contacts[this.contacts.length - 1];
        console.log("New list:", this.contacts);
        this.updateList();
      },
      (error) => {
        console.error('Error adding contact:', error);
      }
    );
  }
  


  getContacts(searchTerm: string): Observable<UserProfile[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    const userId = this.authService.getCurrentUser();
    const url = `${this.baseUrl}/${userId}/search`;
    return this.http.get<UserProfile[]>(url, { params });
  }

  getconversationid( receiver: number): string{
     const sender = this.authService.getCurrentUser();
    
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

  getAvatarByUserId(userIdParam: number): string | undefined {
   
    const matchingContact = this.contacts.find(contact => contact.userid === userIdParam);
    // If a matching contact is found, return its avatar; otherwise, return undefined
    return matchingContact?.avatar;
  }

  
 
}
