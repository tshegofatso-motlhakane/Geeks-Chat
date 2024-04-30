import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserProfile } from 'src/app/Model/user.model';
import { AuthService } from 'src/app/Service/auth.service';
import { ContactService } from 'src/app/Service/contact.service';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from 'src/app/Service/chat.service';
import { ProfileComponent } from '../profile/profile.component';

import { MessageService } from 'src/app/Service/message.service';
import { MessageList } from 'src/app/Model/message.model';
import { tap } from 'rxjs';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  messagelist: MessageList[] = [];
  Users: UserProfile[] = [];
  CurrentUser: String = "";
  avatar: String = "";
  searchUsername: string = '';
  filteredMessagelist: MessageList[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    public contactService: ContactService,
    public chatService: ChatService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fetchContacts();
    this.Users = this.contactService.contacts;
    this.contactService.messageList$.subscribe(newList => {
    
      this.messagelist = newList;
      this.filteredMessagelist = this.messagelist;

    });

    this.updateCurrentUsr();

  }

  onSearchChange(): void {
    this.filteredMessagelist = this.filterContacts(this.messagelist, this.searchUsername);
  }

  filterContacts(contacts: MessageList[], searchTerm: string): MessageList[] {
    return contacts.filter(contact => contact.username.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  updateCurrentUsr() {
    const currentUserString = this.authService.getCurrentUserInfo();

    if (currentUserString) {
      ;
      this.CurrentUser = currentUserString.username;
      this.avatar = currentUserString.avatar;
    }

  }

  fetchContacts(): void {
    const userId: number | undefined = this.authService.getCurrentUserInfo()?.userid;
    if(userId)
    this.contactService.fetchContacts(userId).subscribe(
      (fetchedContacts: UserProfile[]) => {
        this.Users = fetchedContacts;
      },
      (error: any) => {
        // Handle error if needed
        console.error('Error fetching contacts:', error);
      }
    );

  }

  getContacts() {

    this.Users = this.contactService.contacts;
  }

  selectUser(selectedUser: MessageList) {
    this.getContacts();
    console.log("selected " + selectedUser.username);

    // Find the user in the names2 array based on the user ID
    const selected = this.Users.find(user => user.userid === selectedUser.userid);
    const conv = this.contactService.getconversationid(selectedUser.userid);
    if (selected) {
      // Set the selected user in the chatService
      this.chatService.selectedUser = selected;
      const number = this.messageService.countReceivedMessages(conv);
      this.messagelist = this.messagelist.map(message => {
        if (message.userid === selected.userid) {
          if (number > 0) {
            message.unread = 0; // Update unread count for the selected user
          }
        }
        return message;
      });
      // Get the conversation ID and navigate to the chat

      this.messageService.updateMessageStatus(conv).pipe(
        tap(() => {
          // Perform side effects here
        })
      ).subscribe(
        () => {
          // Empty success callback
        },
        (error) => {
          console.error('Error updating message status:', error);
        }
      );

      this.router.navigate(['/chat', conv]);
    } else {
      console.error('User not found in the names2 array');
      // You might want to handle this case, for example, show a message to the user
    }
  }

  openAddContactDialog(): void {
    const dialogRef = this.dialog.open(AddContactComponent, {
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe(result => {


    });
  }


  openProfileDialog(): void {
    const dialogRef = this.dialog.open(ProfileComponent, {
      panelClass: 'custom-dialog-container', // Add a custom class to the dialog container
    });

  }


  logout(): void {
    if (this.authService.logout()) {
    //  localStorage.clear();
      this.messageService.clearMessages();
      this.contactService.contacts = [];
      //  this.contactService.clearContactList();
      this.router.navigate(['/login']);
    } else {
      console.log("failed to log out");
    }
  }
}
