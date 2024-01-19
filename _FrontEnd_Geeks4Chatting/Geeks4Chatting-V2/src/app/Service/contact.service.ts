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
      let unread: number = 0;
      let conv = this.getconversationid(userId);
      unread = this.messageService.countReceivedMessages(conv);
    const updatedList = currentList.map(message => {
      if (message.userid === userId) {
        message.lastestText = updatedMessage.content;
        message.timestamp = updatedMessage.timestamp;
        message.unread = unread;
      }
      return message;
    });
  
    this.messageListSubject.next(updatedList);
  }

  updateList(): void {
      const updatedMessageList: MessageList[] = this.contacts.map(user => {
      const conversationId = this.getconversationid(user.userid);
      const lastMessageText = this.messageService.getLastMessageText(conversationId);
      let unread: number = 0;
      unread = this.messageService.countReceivedMessages(conversationId);
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
        this.contacts = updatedContacts;
        const newContact: UserProfile = this.contacts[this.contacts.length - 1];
        this.updateList();
      },
      (error) => {
        console.error('Error adding contact:', error);
      }
    );
  }
  


  getContacts(searchTerm: string): Observable<UserProfile[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    const userId = this.authService.getCurrentUserInfo()?.userid;
    const url = `${this.baseUrl}/${userId}/search`;
    return this.http.get<UserProfile[]>(url, { params });
  }

  getconversationid( receiver: number): string{
     const sender = this.authService.getCurrentUserInfo();
    
   if(sender)
   {
    if(sender.userid < receiver)
    {
      return sender.userid+"_"+receiver;
    }else
    if(sender.userid > receiver)
    {
      return receiver+"_"+sender.userid;
    }else
    {
      return "ubnormal chatid";
    }
   }else
   {
    return 'user not logged in';
   }

  }

  getAvatarByUserId(userIdParam: number): string | undefined {
    console.log(this.contacts);
    const matchingContact = this.contacts.find(contact => contact.userid === userIdParam);
    console.log(matchingContact);
    // If a matching contact is found, return its avatar; otherwise, return undefined
    return matchingContact?.avatar;
  }

  
 
}
