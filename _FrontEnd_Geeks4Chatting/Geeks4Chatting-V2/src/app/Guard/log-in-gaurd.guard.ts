import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const logInGaurdGuard: CanActivateFn = (route, state) => {
  console.log("Guard is executing");
  console.log(route.toString);
  if (sessionStorage.getItem('currentUser')) {
     // Redirect to dashboard or another page if the user is already logged in
    console.log("present user");
    const router = inject(Router);
     router.navigate(['/chat']);
    return false;// Allow access to both login and register pages if the user is not logged in
  } else {
     // Redirect to dashboard or another page if the user is already logged in
     console.log("no present user");
    return true;
  }
};
