import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { HttpClient } from '@angular/common/http';
import { Message, MessageStatus } from '../Model/message.model';
import { MessageService } from './message.service';
import { ContactService } from './contact.service';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Stomp.Client;
  private conversationIds: string[] = [];
  private baseUrl = 'http://localhost:8080/api/contact';

  constructor(
    private http: HttpClient,
    private contactService: ContactService,
    private messageService: MessageService,
    private authService : AuthService
  ) {
    const socket = new SockJS('http://localhost:8080/api/chat'); // Update with your server endpoint
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame) => {
      console.log('Connected to WebSocket');
      // Additional logic on connect
      this.subscribeToConversations();
    });

    this.stompClient.debug = (message) => {
      console.log(message);
    };
  }

  fetchConversationIds(userId: number): void {
    const url = `${this.baseUrl}/get/${userId}/conversationIDs`;

    this.http.get<string[]>(url).subscribe(
      (data) => {
        console.log('Conversation IDs:', data);
        this.conversationIds = data; // Store the response in the array
        // Subscribe to conversations once IDs are fetched
      },
      (error) => {
        console.error('Error fetching conversation IDs:', error);
      }
    );
  }

  sendMessage(message: Message): Observable<any> {
    const destination = `/app/api/chat/${message.conversationId}`;
     this.stompClient.send(destination,{ 'ack': 'client' }, JSON.stringify(message));
     return of(null); 
  }



  updateMessageStatus(messageId: number) {
    console.log("Step 3");

    const baseUrl = 'http://localhost:8080/api/messages';
    const url = `${baseUrl}/updateStatus/${messageId}`;
    
    this.http.put<string>(url,{}).subscribe(
        response => {
            console.log("Step 3 response : " + response);
            // Handle the response as needed
        },
        error => {
            console.error(error);
            // Handle the error
        }
    );
}


  subscribeToConversations(): void {
    console.log(this.conversationIds);
    if(this.conversationIds)
    {
      this.conversationIds.forEach((conversationId) => {
        const destination = `/topic/messages/${conversationId}`;
    
        this.stompClient.subscribe(destination, (message) => {


          const parsedMessage: Message = JSON.parse(message.body);
          parsedMessage.status = MessageStatus.Received;
       
          this.updateMessageStatus(parsedMessage.messageid);
          this.callupdate(conversationId,parsedMessage);
          this.messageService.addMessage(conversationId, parsedMessage);

          
        });
      });
    }
    
  }

  subscribeToConversation(conversationId: string): void {
    const destination = `/topic/messages/${conversationId}`;
    console.log('new Subscribing to ' + destination);
    const subscription = this.stompClient.subscribe(destination, (message) => {
      const parsedMessage: Message = JSON.parse(message.body);
      console.log('Received message:', parsedMessage);
      parsedMessage.status = MessageStatus.Received;
      this.updateMessageStatus(parsedMessage.messageid);
      this.messageService.addMessage(conversationId, parsedMessage);
      this.callupdate(conversationId,parsedMessage);
    });
  
  }

  callupdate(conversation : string , message : Message){
    const [user1,user2] = conversation.split('_').map(Number);
    console.log("Step 4 + firstime calling updatelastesMesFOr User");

    if(user1 === this.authService.getCurrentUser())
    {
      console.log("Update message 1" );
      this.contactService.updateLatestMessageForUser(user2,message);
    }else
    {
      console.log("Update message 2" );
      this.contactService.updateLatestMessageForUser(user1,message);
    }
  }
  
}

