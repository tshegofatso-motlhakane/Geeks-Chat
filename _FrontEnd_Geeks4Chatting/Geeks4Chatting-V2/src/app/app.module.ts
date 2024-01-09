import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Component/login/login.component';
import { RegisterComponent } from './Component/register/register.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon'
import { RouterModule } from '@angular/router';
import { ChatComponent } from './Component/chat/chat.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatListComponent } from './Component/chat-list/chat-list.component';
import { ChatThreadComponent } from './Component/chat-thread/chat-thread.component';
import { AddContactComponent } from './Component/add-contact/add-contact.component';
import {MatDialogModule  } from '@angular/material/dialog';
import { ProfileComponent } from './Component/profile/profile.component';
import { ProfileAvatarsComponent } from './Component/profile-avatars/profile-avatars.component';
import {MatGridListModule} from '@angular/material/grid-list';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChatComponent,
    ChatListComponent,
    ChatThreadComponent,
    AddContactComponent,
    ProfileComponent,
    ProfileAvatarsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    RouterModule,
    HttpClientModule,
    MatDialogModule ,
    MatGridListModule
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
