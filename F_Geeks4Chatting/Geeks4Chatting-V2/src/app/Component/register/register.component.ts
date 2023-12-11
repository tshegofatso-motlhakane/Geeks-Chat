import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { createUser } from 'src/app/Model/user.model';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  form : FormGroup;


  constructor(private router: Router,private authService : AuthService ) {
    this.form = new FormGroup({
      username: new FormControl('',Validators.required),
      email: new FormControl('',[Validators.required]),
      password : new FormControl('',[Validators.required]),
      confirmPassword : new FormControl('',[Validators.required])
    },
    
    {
      validators : this.passwordMatchValidator,
    });
  }

  passwordMatchValidator(control : AbstractControl){

    return control.get('password')?.value === control.get('confirmPassword')?.value
    ? null : {mismatch : true };
  
  }

  register() : void{
    if(this.form.valid)
    {
     const newuser: createUser = {
      username: this.form.get('username')?.value,
      email:this.form.get('email')?.value,
      password:this.form.get('password')?.value
     };
       this.authService.register(newuser).subscribe({
         next: (response) => {
           // Handle successful register, 'response' will contain user details
           if (response != null) {
   
             console.log('Registartaion successful', response.username);
             sessionStorage.setItem('currentUser', JSON.stringify(response))
             this.router.navigate(['/chat']);
           } else {
             console.log('Failed to register', response);
             this.router.navigate(['/login']);
           }
   
         },
         error: (error) => {
           // Handle login error
           console.error('Resgistration failed', error);
           // Display a user-friendly error message based on the error type
           if (error.status === 400) {
             console.error('User username already exist');
             // You may want to display an error message to the user.
           } else {
             console.error('An unexpected error occurred.');
             // You may want to display a generic error message to the user.
           }
         },
       });
    }else
    {
     console.log("invalid form");
    }
 }
 
 
 login() : void{

   this.router.navigate(["/login"]);
 }
}
