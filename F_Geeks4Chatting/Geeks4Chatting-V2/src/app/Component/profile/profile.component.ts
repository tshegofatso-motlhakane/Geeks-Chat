import { Component } from '@angular/core';
import { UserProfile } from 'src/app/Model/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: UserProfile = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    profilePic: '',
    bio: ''
  };

  onSubmit() {
    // Implement logic to update user details (e.g., make an API call)
    console.log('User details updated:', this.user);
  }
}
