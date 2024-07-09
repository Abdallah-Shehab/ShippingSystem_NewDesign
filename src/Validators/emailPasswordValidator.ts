import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthServiceService } from '../Services/auth-service.service';
import { ILogin } from '../Models/i-login';

export function emailPasswordValidator(authService: AuthServiceService,role:string): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // const email = control.get('Email')?.value;
    // const password = control.get('Password')?.value;
    // let empData:ILogin={email:email,password:password}

    // if (!email || !password) {
    //   console.log("nulll");
    //   return of(null); 
    // }

    
    // return authService.login(empData,role).pipe(
    //   map(r => {   
    //     var response = JSON.parse(r);
    //     if(response.msg == "Email Not Valid") {
    //       return { invalidEmailLogin: 'Invalid email. Please try again.' };
    //     } else if(response.msg === "password Not Valid") {
    //       return { invalidPasswordLogin: 'Invalid password. Please try again.' };
    //     } else {  //email and password correct
    //       return null;
    //     }
    //   }),
    //   catchError(error => {
    //     return of({ somethingWrong: 'Invalid response format. Please try again.' });
    //   })
    // );
    return of(null);
  };
}
