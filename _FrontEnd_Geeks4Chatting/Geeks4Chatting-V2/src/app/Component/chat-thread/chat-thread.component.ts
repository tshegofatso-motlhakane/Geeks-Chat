import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message, MessageStatus } from 'src/app/Model/message.model';
import { User, UserProfile } from 'src/app/Model/user.model';
import { AuthService } from 'src/app/Service/auth.service';
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
  currentUser = this.authService.getCurrentUser();
  messages: Message[] = [];
  conversationId: string = "";
  newMessageContent: string = '';
  disableScrollDown = false;
  useravatar: string | null = '';
  contactavatar: string | undefined= "";

  constructor(
    public chatService: ChatService,
    private messageService: MessageService,
    private websocketService: WebSocketService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private contactService : ContactService) { }

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
    this.getavatars(this.conversationId);
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
    } catch (err) { }
  }

  getavatars(conversationId: string) {
    const user: UserProfile | null = this.authService.getCurrentUserInfo();

    if (user) {
      this.useravatar = user.avatar;
      console.log("current user " + this.useravatar);
    }

    const [user1, user2] = conversationId.split('_').map(Number);
    if (user1 === this.currentUser) {
        this.contactavatar = this.contactService.getAvatarByUserId(user2);
        console.log("user 2 : " + this.contactavatar);

    } else {
      this.contactavatar = this.contactService.getAvatarByUserId(user1);
      console.log("user 1: " + this.contactavatar);
    }
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

    this.websocketService.sendMessage(message);

    this.newMessageContent = '';
  }


}



