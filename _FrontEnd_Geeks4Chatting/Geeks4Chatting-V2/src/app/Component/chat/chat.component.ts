import {  AfterViewInit, Component, OnInit } from '@angular/core';
import { UserProfile } from 'src/app/Model/user.model';
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

   
    private user : UserProfile | null = this.authService.getCurrentUserInfo();
    constructor(private websocketService : WebSocketService,
     private contactService : ContactService,
     private messageService : MessageService,
     private authService : AuthService ) {

   }
  ngOnInit(): void {

    if(this.user)
    this.websocketService.fetchConversationIds(this.user.userid);
    this.getold();
    
  }

  getold() {
    if(this.user)
        this.messageService.getOldMessages(this.user.userid).subscribe(
          () => {
           this.contactService.updateList();
          },
          (error) => {
            console.error('Error fetching old messages:', error);
          }
        );

  }

}
