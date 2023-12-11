import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { HttpClient } from '@angular/common/http';
import { Message, MessageStatus } from '../Model/message.model';
import { MessageService } from './message.service';
import { ContactService } from './contact.service';
import { Observable } from 'rxjs';

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
    private messageService: MessageService
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

  sendMessage(message: Message): void {
    console.log(message.conversationId + ' websock serv');
    const destination = `/app/api/chat/${message.conversationId}`;
    this.stompClient.send(destination,{ 'ack': 'client' }, JSON.stringify(message));
  }

  updateMessageStatus(messageId: number) {
    console.log("calling updated status line");
    const baseUrl = 'http://localhost:8080/api/messages';
    const url = `${baseUrl}/updateStatus/${messageId}`;
    
    this.http.put<string>(url, {}).subscribe(
        response => {
            console.log(response);
            // Handle the response as needed
        },
        error => {
            console.error(error);
            // Handle the error
        }
    );
}


  subscribeToConversations(): void {
    this.conversationIds.forEach((conversationId) => {
      const destination = `/topic/messages/${conversationId}`;
      console.log('Subscribing to ' + destination);
      this.stompClient.subscribe(destination, (message) => {
        const parsedMessage: Message = JSON.parse(message.body);
        console.log('Received message:', parsedMessage);
        parsedMessage.status = MessageStatus.Received;
        this.updateMessageStatus(parsedMessage.messageid);
        this.messageService.addMessage(conversationId, parsedMessage);
      });
    });
  }

  subscribeToConversation(conversationId: string): void {
    const destination = `/topic/messages/${conversationId}`;
    console.log('new Subscribing to ' + destination);
    
    const subscription = this.stompClient.subscribe(destination, (message) => {
      const parsedMessage: Message = JSON.parse(message.body);
      console.log('Received message:', parsedMessage);
      parsedMessage.status = MessageStatus.Received;
      this.messageService.addMessage(conversationId, parsedMessage);
    });
  
  }
  
}

