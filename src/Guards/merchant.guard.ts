import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GlobalService } from '../Services/global.service';

export const merchantGuard: CanActivateFn = (route, state) => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const router = inject(Router);
  if (inject(GlobalService).globalVariable.roleName =="Merchant") {
  // if (role?.toLowerCase() == ("Merchant").toLowerCase()) {
        return true;
  } 
  else {
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

