 
import { Injectable, OnInit } from '@angular/core';
import { AuthServiceService } from './auth-service.service';
import { RolesService } from './roles.service';
 

@Injectable({
  providedIn: 'root'
})

export class GlobalService  {
  public globalVariable: any = 'Initial Value';

public AllPermissions:any=[]
 

  public idForAccount!: number;

  constructor(private authService: AuthServiceService, private roleService: RolesService) {}

  loadGlobalData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let Allpermissions: any[] = [];
      
      if (this.authService.getToken() !== null) {
        this.globalVariable = this.authService.getDecodedToken();
        this.idForAccount = this.globalVariable.id;
  
        this.roleService.GetPermissions(Number(this.globalVariable.roleId)).subscribe({
          next: (data) => {
            Allpermissions = data;
            console.log(Allpermissions); // This will now log the correct data
            resolve(Allpermissions);
          },
          error: (err) => {
            console.log(err);
            reject(err);
          }
        });
      } else {
        resolve(Allpermissions); // Resolve with empty array if no token is found
      }
    });
  }

 

  public getEntitiesPermissions(permissions:any,type: string) {
    return    permissions.filter((permission: any) => permission.entityName === type);
     
  
  }

  AllReadPermissons(permissions:any){
    return permissions.reduce((acc:any, permission:any) => {
      acc[permission.entityName] = permission.canRead;
      return acc;
   
    }, {} as { [key: string]: boolean });
  }
}

 