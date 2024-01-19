import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User, UserProfile } from 'src/app/Model/user.model';
import { ProfileAvatarsComponent } from '../profile-avatars/profile-avatars.component';
import { ChatService } from 'src/app/Service/chat.service';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @ViewChild(ProfileAvatarsComponent) profileAvatarsComponent!: ProfileAvatarsComponent;

  user!: UserProfile;
  private dialogref : any;
  constructor( private dialog: MatDialog,
    private chatService: ChatService,
    private authService : AuthService){

  }
  ngOnInit(): void {
    this.SetUserInfo();
  }
  
   SetUserInfo() {
    if (sessionStorage.getItem("userInfo")) {
      const currentUserString : UserProfile | null = this.authService.getCurrentUserInfo();
      if (currentUserString) {
  
        this.user = currentUserString;
      }
    }
  }

  onSubmit() {
    
  //  sessionStorage.setItem("userInfo",JSON.stringify(this.user));
  //  this.SetUserInfo();

    this.chatService.updateUserInfo(this.user);

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
      this.dialogref.close();
    });
  }

  saveDetails(selectedAvatar:string){
    this.user.avatar = selectedAvatar;
  }

  
}
