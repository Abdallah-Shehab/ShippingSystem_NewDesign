import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const deliveryGuard: CanActivateFn = (route, state) => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const router = inject(Router);
  if (role?.toLowerCase() == ("Delivery").toLowerCase()) {
        return true;
  } else {
    if(token){
      router.navigate(['/']);
      return false;
    }
    else{
      router.navigate(['/*']); //NotFound component
      return false;
    }
  }
};
