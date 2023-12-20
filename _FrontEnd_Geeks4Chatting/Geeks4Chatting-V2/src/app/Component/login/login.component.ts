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
  formSubmitted : boolean = false;
  formError : boolean = false;
  errorMessage : string = "";

  constructor(private fb: FormBuilder , private router: Router,private authService : AuthService) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      this.formError = false;
      this.authService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value).subscribe({
        next: (response) => {
       
          if ( response.data != null) {
  
            console.log(response.message);
            sessionStorage.setItem('currentUser', JSON.stringify(response.data))
            this.router.navigate(['/chat']);
          } else {
            console.log("ERROR : " + response.status +" => "+response.message);
            this.loginfail = true;
            this.errorMessage = response.message; 
          }
  
        },
        error: (error) => {
          console.log("Problem " + error);
        },
      });
    } else {
      // Handle the case where the form is not valid
      this.formError = true;
      this.errorMessage = "Please fill in the required fields!";
      console.log('Form is not valid.');
    }
  }

  register() {
   
    this.router.navigate(['/register']);
    console.log('Redirecting to registration page');
    // Use Angular router or other navigation methods
  }
}
