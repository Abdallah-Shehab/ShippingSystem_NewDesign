import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { GlobalService } from '../../Services/global.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet ,RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  constructor(private globalService:GlobalService,private router:Router) {
   
  
  }
 
  ngOnInit() {
    // Usage example
    this.globalService.loadGlobalData().then((permissions) => {
      console.log('Permissions:', permissions); 
      this.AllPermissions = permissions;
      this.roleName = this.globalService.globalVariable.roleName;
      this.permissions = this.globalService.AllReadPermissons(this.AllPermissions);
      this.permissionsKeys = Object.keys(this.permissions);
      
      console.log(this.roleName);
      console.log(this.permissions);
    }).catch((error) => {
      console.error('Error loading permissions:', error);
    });
  }
  
  // Define your class properties here
  roleName: string = '';
  AllPermissions: any;
  
  permissions: { [key: string]: boolean } = {};
  permissionsKeys: string[] = [];
 
  logOut(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }
}

// toggleDarkMode() {
//   console.log("clicle")
//   this.isDarkMode = !this.isDarkMode;
//   const theme = this.isDarkMode ? 'dark' : 'light';
//   document.documentElement.setAttribute('data-bs-theme', theme);
// }