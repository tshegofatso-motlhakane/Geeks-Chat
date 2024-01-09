import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User, UserProfile } from 'src/app/Model/user.model';
import { ProfileAvatarsComponent } from '../profile-avatars/profile-avatars.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @ViewChild(ProfileAvatarsComponent) profileAvatarsComponent!: ProfileAvatarsComponent;

  user!: UserProfile;
  private dialogref : any;
  constructor( private dialog: MatDialog){

  }
  ngOnInit(): void {
    this.newMethod();
  }
  
   newMethod() {
    if (sessionStorage.getItem("userInfo")) {
      const currentUserString = sessionStorage.getItem('userInfo');

      if (currentUserString) {
        const currentUser: UserProfile = JSON.parse(currentUserString);
        console.log("current niggah : " + currentUser);
        this.user = currentUser;
      }

    }
  }

  onSubmit() {
    // Implement logic to update user details (e.g., make an API call)
    console.log('User details updated:', this.user);
  }

  updateAvatar(){
     this.dialogref = this.dialog.open(ProfileAvatarsComponent, {
      panelClass: 'custom-dialog-container',
      data: { selectedAvatar: this.user.avatar }
    });
    
    this.dialogref.componentInstance.selectAvatar.subscribe((selectedAvatar: string) => {
      console.log(selectedAvatar);
      this.saveDetails(selectedAvatar);
    });
  }

  saveDetails(selectedAvatar:string){

    this.user.avatar = selectedAvatar;
  }

  
}
