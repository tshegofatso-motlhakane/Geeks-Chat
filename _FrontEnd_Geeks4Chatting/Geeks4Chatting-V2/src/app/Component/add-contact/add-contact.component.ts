import { ChangeDetectorRef, Component } from '@angular/core';
import { CreateContact, User, UserProfile } from 'src/app/Model/user.model';
import { AuthService } from 'src/app/Service/auth.service';
import { ContactService } from 'src/app/Service/contact.service';
import { WebSocketService } from 'src/app/Service/web-socket.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent {

  searchTerm: string = "";
  searchResults: UserProfile[] = [];
  error: any;
  showEmptyMessage: boolean = false;


  constructor(
    private contactService: ContactService,
private websocketService : WebSocketService,
private authService : AuthService){}
  //Method retrieves user using a key word given by the user
  searchUsers() {
    this.contactService.getContacts(this.searchTerm).subscribe(
      results => {
        this.searchResults = results;
        this.showEmptyMessage = this.searchResults.length === 0;
      },
      error => {
        this.searchResults = [];
        this.error = error;
        console.error('Error searching users', error);
      }
    );
  }
  
  addContact(contactid: number) {
    const currentUserString : UserProfile | null = this.authService.getCurrentUserInfo();
    if (currentUserString) {
      console.log(currentUserString);
      const currentUser: number = currentUserString.userid;
      const newContact: CreateContact = {
        user1: currentUser,
        user2: contactid,
      };

      const index = this.searchResults.findIndex(user => user.userid === contactid);
      this.searchResults.splice(index, 1);

      // Update this.searchResults by removing the contact
        console.log(this.searchResults)
        this.searchResults = this.searchResults;

      this.contactService.addNewContactToList(newContact);
      const conv = this.contactService.getconversationid(newContact.user2);
      this.websocketService.subscribeToConversation(conv);
     
    }
  }
}
