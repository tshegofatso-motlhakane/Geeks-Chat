import {  AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Service/auth.service';
import { ContactService } from 'src/app/Service/contact.service';
import { MessageService } from 'src/app/Service/message.service';
import { WebSocketService } from 'src/app/Service/web-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit  {

   
    private user : number = this.contactService.getCurrentUser()
    constructor(private websocketService : WebSocketService,
     private contactService : ContactService,
     private messageService : MessageService) {

   }
  ngOnInit(): void {
    this.websocketService.fetchConversationIds(this.user);
    this.getold();
    
  }

  getold() {
        this.messageService.getOldMessages(this.user).subscribe(
          () => {
           this.contactService.updateList();
          },
          (error) => {
            console.error('Error fetching old messages:', error);
          }
        );

  }

}
