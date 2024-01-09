import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  currentUser = this.contactService.getCurrentUser();
  messages: Message[] = [];
  conversationId: string = "";
  newMessageContent: string = '';
  disableScrollDown = false

  constructor(
    public chatService: ChatService,
    private contactService: ContactService,
    private messageService: MessageService,
    private websocketService: WebSocketService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.conversationId = params['conversationId'];
      // Update messages based on the new conversationId
      this.messageService.getMessagesForConversation(this.conversationId).subscribe((messages) => {
        this.messages = messages;
      });
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
}

 onScroll() {
    let element = this.myScrollContainer.nativeElement
    let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
    if (this.disableScrollDown && atBottom) {
        this.disableScrollDown = false
    } else {
        this.disableScrollDown = true
    }
}


private scrollToBottom(): void {
    if (this.disableScrollDown) {
        return
    }
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
}

  sendMessage(): void {

    if (this.newMessageContent.trim() === '') {
      return;
    }

    const message: Message = {
      messageid: 0,
      sender: this.currentUser, // Replace with the actual sender
      content: this.newMessageContent,
      conversationId: this.conversationId,
      timestamp: new Date(),
      status: MessageStatus.Sent
    };

    const [user1, user2] = this.conversationId.split('_').map(Number);

    // send message through websocket
    console.log("Step 1");
    this.websocketService.sendMessage(message);
    // console.log("Step 6");

    // if (user1 === this.currentUser) {
    //   console.log("Update message 1");
    //   this.contactService.updateLatestMessageForUser(user2, message);
    // } else {
    //   console.log("Update message 1");
    //   this.contactService.updateLatestMessageForUser(user1, message);
    // }

    // Clear the input field after sending the message
    this.newMessageContent = '';
  }


}



