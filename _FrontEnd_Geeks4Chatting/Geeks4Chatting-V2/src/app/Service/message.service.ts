import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Message, MessageStatus } from '../Model/message.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UserProfile } from '../Model/user.model';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private conversations: { [key: string]: BehaviorSubject<Message[]> } = {};
  private currentUser : UserProfile | null = this.authService.getCurrentUserInfo();

  private baseUrl = 'http://localhost:8080/api/messages';


  constructor(private http: HttpClient, private authService : AuthService) {
  }

  getMessagesForConversation(conversationId: string): Observable<Message[]> {
    if (!this.conversations[conversationId]) {
      this.conversations[conversationId] = new BehaviorSubject<Message[]>([]);
    }
    return this.conversations[conversationId].asObservable();
  }



  addMessage(conversationId: string, message: Message): void {

    if (!this.conversations[conversationId]) {
      this.conversations[conversationId] = new BehaviorSubject<Message[]>([]);
    }
    const currentMessages = this.conversations[conversationId].getValue();
    const updatedMessages = [...currentMessages, message];
    this.conversations[conversationId].next(updatedMessages);
  }

  updateMessageStatus(conversationId: string): Observable<void> {
    const url = `${this.baseUrl}/updateStatusToRead/${conversationId}`;
    return this.http.put<void>(url, {}).pipe(
      tap(() => {
        this.updateConversation(conversationId);
      })
    );
  }
  updateConversation(conversationId: string): void {
    const messages = this.conversations[conversationId]?.getValue() || [];

    // Update the conversation logic as needed
    // For example, mark all messages in the conversation as read
    const updatedMessages = messages.map(message => {
      if (message.status === MessageStatus.Received) {
        message.status = MessageStatus.READ;
      }
      return message;
    });

    // Update the BehaviorSubject with the new value
    this.conversations[conversationId]?.next(updatedMessages);
  }

  getOldMessages(userId: number): Observable<Message[]> {
    this.clearMessages();
    const url = `${this.baseUrl}/${userId}/oldMessages`;
    return this.http.get<Message[]>(url).pipe(
      tap(messages => {

        messages.forEach(message => {
          const conversationId = message.conversationId;

          // If the conversation ID exists in the conversations map
          if (this.conversations[conversationId]) {
            const currentMessages = this.conversations[conversationId].getValue();
            const updatedMessages = [...currentMessages, message];
            this.conversations[conversationId].next(updatedMessages);
          } else {
            // If the conversation ID does not exist, create a new BehaviorSubject
            this.conversations[conversationId] = new BehaviorSubject<Message[]>([message]);
          }
        });
      })
    );
  }

  getLastMessageText(conversationId: string): Message {
    const messages = this.conversations[conversationId]?.getValue() || [];

    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      return lastMessage;
    } else {
      const emptyMessage: Message = {
        messageid: 0,
        sender: 0, // Set the appropriate default value
        content: '',
        conversationId: '',
        timestamp: new Date(), // Set the appropriate default value
        status: MessageStatus.Sent // Set the appropriate default value
      };

      return emptyMessage;
    }
    // Or any default value
  }



  getReceivedMessagesCount(conversationId: string): Observable<number> {
    return this.getMessagesForConversation(conversationId).pipe(
      map(messages => messages.filter(message => message.status === MessageStatus.Received).length)
    );
  }

  getReceivedMessagesCount2(conversationId: string): Observable<number> {
    return this.getMessagesForConversation(conversationId).pipe(
      map(messages => {
        const currentUser : number | undefined = this.authService.getCurrentUserInfo()?.userid; // Replace with actual method
        return messages.filter(
          message => message.status === MessageStatus.Received && message.sender !== currentUser
        ).length;
      })
    );
  }

  countReceivedMessages(conversationId: string): number {
    const conversation = this.conversations[conversationId]?.value || [];
    const currentUser : number | undefined = this.authService.getCurrentUserInfo()?.userid; // Replace with actual method
    return conversation.reduce((count, message) => {
      if (message.status === MessageStatus.Received && message.sender !== currentUser) {
        return count + 1;
      }
      return count;
    }, 0);
  }
  
  clearMessages(): void {
    // Iterate through each key in the conversations object
    Object.keys(this.conversations).forEach((key) => {
      // Clear the conversation for the current key
      this.conversations[key].next([]);
    });
  }
}
