import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import {  AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../Services/auth-service.service';
// import { emailPasswordValidator } from '../../Validators/emailPasswordValidator';
import { ILogin } from '../../Models/i-login';
import { Router } from '@angular/router';
import { GlobalService } from '../../Services/global.service';

declare function initializeSwiper(): void;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TabViewModule, BadgeModule, AvatarModule,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None // Use None to allow global styles to be applied -> i used it because global style override this compnent style
})

export class LoginComponent implements AfterViewInit {
  accObj?:ILogin;
  
  constructor(private authService:AuthServiceService,private router:Router,private globalService:GlobalService){

  }
  ngAfterViewInit() {
    initializeSwiper();
  }

  empLoginForm: FormGroup = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [Validators.required])
    }, 
  // { asyncValidators: emailPasswordValidator(this.authService,'Employee') }
  );
  
  deliveryLoginForm: FormGroup = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [Validators.required])
    },
  // { asyncValidators: emailPasswordValidator(this.authService,'Delivery') }
  );
  
  
  merchantLoginForm: FormGroup = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [Validators.required])
    }, 
  // { asyncValidators: emailPasswordValidator(this.authService,'Merchant') } 
  );


  handleLogin(role:string) {
    // this.isLoading = true;
  
    if(role=="delivery"){
    if (!this.deliveryLoginForm.valid) {
      this.deliveryLoginForm.markAllAsTouched();
    }
    const { Email, Password } = this.deliveryLoginForm.value;

    if (Email=="") {        
      this.deliveryLoginForm.get('Email')?.setErrors({ 'required': true });
    } 
    if (Password=="") {
      this.deliveryLoginForm.get('Password')?.setErrors({ 'required': true });
    } 
    if(this.deliveryLoginForm.valid){
      this.accObj={email:Email,password:Password};
      this.authService.login(this.accObj,'Delivery').subscribe({
        next: (res: any) => {
          var response = JSON.parse(res);
          console.log(res)
          console.log(response)
          if(response.msg =="Email Not Valid"){
            this.deliveryLoginForm.get('Email')?.setErrors({ 'invalidEmailLogin': true });
          }
          else if(response.msg =="password Not Valid"){
            this.deliveryLoginForm.get('Password')?.setErrors({ 'invalidPasswordLogin': true });
          }
          else{  //email and password are correct
            const jsonObject = JSON.parse(res);
            localStorage.setItem('token', jsonObject.readLoginDTO.token);
            this.globalService.loadGlobalData().then(() => {
              this.router.navigate(['/']);
            });
          
          

            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.deliveryLoginForm.get('Password')?.setErrors({ 'somethingWrong': true });
        }
      });
    }
    }
    else if(role=="employee"){
    if (!this.empLoginForm.valid) {
      this.empLoginForm.markAllAsTouched();
    }
    const { Email, Password } = this.empLoginForm.value;

    if (Email=="") {        
      this.empLoginForm.get('Email')?.setErrors({ 'required': true });
    } 
    if (Password=="") {
      this.empLoginForm.get('Password')?.setErrors({ 'required': true });
    } 
    if(this.empLoginForm.valid){
      this.accObj={email:Email,password:Password};

      this.authService.login(this.accObj,'Employee').subscribe({
      next: (res: any) => {
        var response = JSON.parse(res);

        if(response.msg=="Email Not Valid"){
          this.empLoginForm.get('Email')?.setErrors({ 'invalidEmailLogin': true });
        }
        else if(response.msg=="password Not Valid"){
          this.empLoginForm.get('Password')?.setErrors({ 'invalidPasswordLogin': true });
        }
        else{  //email and password are correct
          const jsonObject = JSON.parse(res);
          localStorage.setItem('token', jsonObject.readLoginDTO.token);
          this.globalService.loadGlobalData().then(() => {
            this.router.navigate(['/']);
          });
        


          // this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.empLoginForm.get('Password')?.setErrors({ 'somethingWrong': true });
      }
      });
    }
    }
    else if(role =="merchant"){
    if (!this.merchantLoginForm.valid) {
      this.merchantLoginForm.markAllAsTouched();
    }
    const { Email, Password } = this.merchantLoginForm.value;

    if (Email=="") {        
      this.merchantLoginForm.get('Email')?.setErrors({ 'required': true });
    } 
    if (Password=="") {
      this.merchantLoginForm.get('Password')?.setErrors({ 'required': true });
    } 
    if(this.merchantLoginForm.valid){
      this.accObj={email:Email,password:Password};

      this.authService.login(this.accObj,'Merchant').subscribe({
        next: (res: any) => {
          var response = JSON.parse(res);

          if(response.msg=="Email Not Valid"){
            this.merchantLoginForm.get('Email')?.setErrors({ 'invalidEmailLogin': true });
          }
          else if(response.msg=="password Not Valid"){
            this.merchantLoginForm.get('Password')?.setErrors({ 'invalidPasswordLogin': true });
          }
          else{  //email and password are correct
            const jsonObject = JSON.parse(res);
            localStorage.setItem('token', jsonObject.readLoginDTO.token);
            this.globalService.loadGlobalData().then(() => {
              this.router.navigate(['/']);
            });
      


            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.merchantLoginForm.get('Password')?.setErrors({ 'somethingWrong': true });
        }
      });
    }
    } 
  }
}
