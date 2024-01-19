import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User, createUser } from 'src/app/Model/user.model';
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

     this.authService.registerUser(newuser).subscribe(
       (response) => {
          if(response.data != null)
          {
           
             this.authService.setCurrentUserInfo(response);
             this.router.navigate(['/chat']);
          }else{
            console.log("ERROR : " + response.status +" => "+response.message);
             
          }
        
       },
       (error) =>{

        console.log(error);
       }

     );
       
    }else
    {
     console.log("invalid form");
    }
 }
 
 
 login() : void{

   this.router.navigate(["/login"]);
 }
}
