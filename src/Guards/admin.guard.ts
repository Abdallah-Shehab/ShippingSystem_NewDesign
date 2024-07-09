import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GlobalService } from '../Services/global.service';
export const adminGuard: CanActivateFn = (route, state) => {

  const token = localStorage.getItem('token');
 
  const router = inject(Router);
  if (inject(GlobalService).globalVariable.roleName=='Admin') {
  // if (role?.toLowerCase() == ("Admin").toLowerCase()) {
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
