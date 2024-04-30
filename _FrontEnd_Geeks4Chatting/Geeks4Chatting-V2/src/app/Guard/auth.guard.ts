import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
 

  if (sessionStorage.getItem('currentUser')) {
     // Redirect to dashboard or another page if the user is already logged in
    console.log("present user");
  
    return true;// Allow access to both login and register pages if the user is not logged in
  } else {
     // Redirect to dashboard or another page if the user is already logged in
     console.log("no present user");
     const router = inject(Router);
     router.navigate(['/login']);
    return false;
  }
};
