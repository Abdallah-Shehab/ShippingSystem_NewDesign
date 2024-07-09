import { Component, OnInit, ViewChild } from '@angular/core';

import { RolesService } from '../../../Services/roles.service';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [SharedModule,RouterLinkActive],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css'
})
export class PermissionsComponent implements OnInit {
  
  Permissions:any=[];
  TempPermissions:any=[];
  RoleID:any ;
  loading = true;
  @ViewChild('dt2') dt2!: Table;
  searchValue: string | undefined;
  /**
   *
   */
  constructor( private roleService:RolesService , public activeRoute:ActivatedRoute,private messageService: MessageService,private router:Router) {
    
  }
  ngOnInit(): void {
    this.RoleID =this.activeRoute.snapshot.params['id'];
    this.roleService.GetPermissions(this.RoleID).subscribe({
      next:(data)=>{console.log(data); this.Permissions=data ; this.loading=false},
      error:(err)=>console.log(err)
    })
    console.log(this.RoleID)
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = "";
  }
  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (this.dt2) {
      this.dt2.filterGlobal(inputElement.value, 'contains');
    }
  }
  onSwitchChange(event: any,Id:number,permissionType:string) {
    let permission = this.Permissions.find((perm: any) => perm.entityId === Id);
    permission[permissionType] = event.checked;
    // console.log('Switch state:',Id, event.checked,permissionType);
    // console.log('Updated Permissions:', this.Permissions);
  }

  saveChanges() {
    if(this.Permissions.length<=0){
      this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الحفظ' });

    }else{
      this.roleService.UpdateRolePermissions(this.RoleID, this.Permissions)
      .subscribe({
        next: (data) => {console.log('Updated role permissions:', data)
     
          
          this.messageService.add({ severity: 'info', summary: 'تم الحفظ', detail: 'تم حفظ التغيرات ' });
           
        },
        error: (err) =>{console.log('Error updating role permissions:', err);
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الحفظ' });
        }
      });

     

    }

  }

 

 
}
