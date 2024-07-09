import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isLoginGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  if (token == null) {
    router.navigate(['/login']); //NotFound component
        return false;

  } else {
     //NotFound component
      return true;
  }
};
