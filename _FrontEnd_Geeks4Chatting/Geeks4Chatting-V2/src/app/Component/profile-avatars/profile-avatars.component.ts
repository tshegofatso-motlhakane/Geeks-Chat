import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profile-avatars',
  templateUrl: './profile-avatars.component.html',
  styleUrls: ['./profile-avatars.component.scss'],
  
})
export class ProfileAvatarsComponent {
  @Input() selectedAvatar: string | null = null;
  @Output() selectAvatar = new EventEmitter<string>();

  totalAvatars = 16;
  avatars: string[] = Array.from({ length: this.totalAvatars }, (_, index) => `assets/avatar/users-${index + 1}.svg`);

  onAvatarSelected(avatar: string): void {
    this.selectedAvatar = avatar;
    this.selectAvatar.emit(avatar);
  }
}
