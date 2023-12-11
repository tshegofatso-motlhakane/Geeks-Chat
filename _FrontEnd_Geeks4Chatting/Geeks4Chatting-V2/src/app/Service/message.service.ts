import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';
import { Message, MessageList, MessageStatus } from '../Model/message.model';
import { HttpClient } from '@angular/common/http';
import { User } from '../Model/user.model';
import { ContactService } from './contact.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private conversations: { [key: string]: BehaviorSubject<Message[]> } = {};

  

  private baseUrl = 'http://localhost:8080/api/messages';
 

  constructor(private http : HttpClient ) {


  }

  getMessagesForConversation(conversationId: string): Observable<Message[]> {
    if (!this.conversations[conversationId]) {
      this.conversations[conversationId] = new BehaviorSubject<Message[]>([]);
    }
    return this.conversations[conversationId].asObservable();
  }

  // updateLatestMessageForUser(userId: number, updatedMessage: Message) {
  //   const currentList = this.messageListSubject.getValue();
  //   console.log('Current List:', currentList);
  
  //   const updatedList = currentList.map(message => {
  //     if (message.userid === userId) {
  //       console.log('Updating Message:', message);
  //       message.lastestText = updatedMessage.content;
  //       message.timestamp = updatedMessage.timestamp;
  //     }
  //     return message;
  //   });
  
  //   console.log('Updated List:', updatedList);
  
  //   this.messageListSubject.next(updatedList);
  // }
  
  addMessage(conversationId: string, message: Message): void {
    if (!this.conversations[conversationId]) {
      this.conversations[conversationId] = new BehaviorSubject<Message[]>([]);
    }
    
    const [user1, user2] = conversationId.split('_').map(Number);
   // this.updateLatestMessageForUser(user2,message);
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
  console.log(" trying to get old chats");
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
  }else{
    const emptyMessage: Message = {
      messageid:0,
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
  clearMessages(): void {
      // Iterate through each key in the conversations object
      Object.keys(this.conversations).forEach((key) => {
        // Clear the conversation for the current key
        this.conversations[key].next([]);
      });
  }
}
