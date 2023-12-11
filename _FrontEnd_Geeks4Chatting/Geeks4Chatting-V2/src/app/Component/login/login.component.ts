import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  loginfail : boolean = false;

  constructor(private fb: FormBuilder , private router: Router,private authService : AuthService) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value).subscribe({
        next: (response) => {
          // Handle successful login, 'response' will contain user details
          if (response != null) {
  
            console.log('Login successful', response);
            sessionStorage.setItem('currentUser', JSON.stringify(response))
            this.router.navigate(['/chat']);
          } else {
             console.log('user not found', response);
             this.loginfail =true;
             this.router.navigate(['/login']);
          }
  
        },
        error: (error) => {
          // Handle login error
          this.loginfail =true;
          console.error('Login failed', error);
          // Display a user-friendly error message based on the error type
          if (error.status === 401) {
            console.error('Invalid username or password.');
            // You may want to display an error message to the user.
          } else {
            console.error('An unexpected error occurred.');
            // You may want to display a generic error message to the user.
          }
        },
      });
    } else {
      // Handle the case where the form is not valid
      console.log('Form is not valid. Please check your inputs.');
    }
  }

  register() {
   
    this.router.navigate(['/register']);
    console.log('Redirecting to registration page');
    // Use Angular router or other navigation methods
  }
}
