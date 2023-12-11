import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Model/user.model';
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
export class ChatListComponent implements OnInit  {
  messagelist: MessageList[] = [];
  Users: User[] = [];
  CurrentUser : String ="";
  searchUsername: string = '';
  filteredMessagelist: MessageList[] = [];

  constructor(
    // private chatService: ChatService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    public contactService: ContactService,
    public chatService : ChatService,
    private messageService : MessageService
  ) {}
 
  ngOnInit(): void {
    this.fetchContacts();
    this.Users = this.contactService.contacts;
    this.messageService.messageList$.subscribe(newList => {
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

  updateCurrentUsr(){
    const currentUserString = sessionStorage.getItem('currentUser');

    if (currentUserString) {
      const currentUser: User = JSON.parse(currentUserString);
      this.CurrentUser = currentUser.username;
    }

  }
  
  fetchContacts(): void {
    const userId : number = this.contactService.getCurrentUser(); // Get the actual user ID
    this.contactService.fetchContacts(userId).subscribe(
      (fetchedContacts: User[]) => {
        this.Users = fetchedContacts;
        this.messageService.updateList(this.Users);
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
    console.log("selected " + selectedUser.username);
  
    // Find the user in the names2 array based on the user ID
    const selected = this.Users.find(user => user.userid === selectedUser.userid);
  
    if (selected !== undefined) {
      // Set the selected user in the chatService
      this.chatService.selectedUser = selected;
      this.messagelist = this.messagelist.map(message => {
        if (message.userid === selected.userid) {
          message.unread = 0; // Update unread count for the selected user
        }
        return message;
      });
      // Get the conversation ID and navigate to the chat
      const conv = this.contactService.getconversationid(selectedUser.userid);
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

      this.onDialogClosed(result);
    });
  }
  
  onDialogClosed(result: any): void {
    this.getContacts();
  }
  openProfileDialog(): void {
    const dialogRef = this.dialog.open(ProfileComponent, {
      panelClass: 'custom-dialog-container', // Add a custom class to the dialog container
    });
  }


  logout(): void {
    if (this.authService.logout()) {
      localStorage.clear();
      this.messageService.clearMessages();
      this.contactService.contacts = [];
      this.contactService.clearContactList();
      this.router.navigate(['/login']);
    } else {
      console.log("failed to log out");
    }
  }
}
