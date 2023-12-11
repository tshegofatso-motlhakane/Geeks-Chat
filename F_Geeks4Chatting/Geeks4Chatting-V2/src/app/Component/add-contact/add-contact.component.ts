import { ChangeDetectorRef, Component } from '@angular/core';
import { CreateContact, User } from 'src/app/Model/user.model';
import { ContactService } from 'src/app/Service/contact.service';
import { WebSocketService } from 'src/app/Service/web-socket.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent {

  searchTerm: string = "";
  searchResults: User[] = [];
  error: any;
  showEmptyMessage: boolean = false;


  constructor(
    private contactService: ContactService,
private websocketService : WebSocketService){}
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
    let userid;
    const currentUserString = sessionStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser: User = JSON.parse(currentUserString)
      const newContact: CreateContact = {
        user1: currentUser.userid,
        user2: contactid,
      };
      this.searchResults.splice(contactid, 1);

      // Update this.searchResults by removing the contact
        console.log(this.searchResults)

      this.contactService.addNewContactToList(newContact);
      const conv = this.contactService.getconversationid(newContact.user2);
      this.websocketService.subscribeToConversation(conv);
     
    }
  }
}
