import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message, MessageStatus } from 'src/app/Model/message.model';
import { User } from 'src/app/Model/user.model';
import { ChatService } from 'src/app/Service/chat.service';
import { ContactService } from 'src/app/Service/contact.service';
import { MessageService } from 'src/app/Service/message.service';
import { WebSocketService } from 'src/app/Service/web-socket.service';


@Component({
  selector: 'app-chat-thread',
  templateUrl: './chat-thread.component.html',
  styleUrls: ['./chat-thread.component.scss']
})
export class ChatThreadComponent implements OnInit {
  currentUser = this.contactService.getCurrentUser();
  messages: Message[] = [];
   conversationId: string = "";
  newMessageContent: string = '';

  constructor(
    public chatService: ChatService,
    private contactService: ContactService,
    private messageService: MessageService,
    private websocketService: WebSocketService,
    private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
     // this.conversationId = this.getconversationid();
      this.conversationId = params['conversationId'];
      // Update messages based on the new conversationId
      this.messageService.getMessagesForConversation(this.conversationId).subscribe((messages) => {
        this.messages = messages;
      });
    });
  }

  sendMessage(): void {
    if (this.newMessageContent.trim() === '') {
      return;
    }

    const message: Message = {
      messageid:0,
      sender: this.currentUser, // Replace with the actual sender
      content: this.newMessageContent,
      conversationId :this.conversationId,
      timestamp: new Date(),
      status : MessageStatus.Sent
    };
    const [user1,user2] = this.conversationId.split('_').map(Number);
   
    // send message through websocket
    this.websocketService.sendMessage(message);
    if(user1 === this.currentUser)
    {
      console.log("Update message 1" );
      this.contactService.updateLatestMessageForUser(user2,message);
    }else
    {
      console.log("Update message 1" );
      this.contactService.updateLatestMessageForUser(user1,message);
    }
  
    console.log("sending mess" );
    // Clear the input field after sending the message
    this.newMessageContent = '';
  }

  getMessageSenderImage(sender: number): string {
    // Provide the appropriate image URL based on the sender (you can customize this)
    return sender === this.currentUser ? 'url(https://image.flaticon.com/icons/svg/145/145867.svg)' : 'url(https://image.flaticon.com/icons/svg/327/327779.svg)';
  }
 
  getconversationid(sender : number, receiver: number): string{

    
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



