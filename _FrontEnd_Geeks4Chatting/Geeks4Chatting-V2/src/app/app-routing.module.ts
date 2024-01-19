import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './Component/register/register.component';
import { LoginComponent } from './Component/login/login.component';
import { ChatComponent } from './Component/chat/chat.component';
import { authGuard } from './Guard/auth.guard';
import { logInGaurdGuard } from './Guard/log-in-gaurd.guard';

const routes: Routes = [
  { path: 'register', component: RegisterComponent, canActivate :[logInGaurdGuard] },
  { path: 'login', component: LoginComponent , canActivate :[logInGaurdGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'chat', component: ChatComponent , canActivate: [authGuard] },
  { path: 'chat/:conversationId', component: ChatComponent , canActivate: [authGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
