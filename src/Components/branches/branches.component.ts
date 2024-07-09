import { Table } from 'primeng/table';

import { Component, ViewChild } from '@angular/core';
import { BranchesService } from '../../Services/branches.service';

import { DialogComponent } from './dialog/dialog.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { IBranch } from '../../Models/i-branch';
import { GlobalService } from '../../Services/global.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [SharedModule,DialogComponent,RouterLink,CommonModule ],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css'
})
export class BranchesComponent {

  Branches!: IBranch[];
  DialogId = 0;
  loading = true;
  @ViewChild('dt2') dt2!: Table;
  searchValue: string | undefined;
  permissions:any =[];
  constructor(public branchesService: BranchesService,private messageService: MessageService,    private globalService:GlobalService) {
 
  }

  ngOnInit() {
    this.GetAll();
    this.globalService.loadGlobalData().then((permissions) => {
      this.permissions = this.globalService.getEntitiesPermissions(permissions,"الفروع");
      console.log(this.permissions)
          
        }).catch((error) => {
          console.error('Error loading permissions:', error);
        });
  
  }
  changeIdVal(id:number){
    this.DialogId=id;
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

  GetAll() {
    this.branchesService.GetAllBranches().subscribe({
      next: (data) => {
        
        this.Branches = data as IBranch[];
        this.loading=false;
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'لا يوجد فروع' })

    });
  }

  Delete(id: number) {
    this.branchesService.DeleteBranch(id).subscribe({
      next: (data: any) => {
        this.Branches = this.Branches.filter((i: any) => i.id !== id);
        this.messageService.add({ severity: 'error', summary: 'تم الحذف', detail: 'تم حذف الفرع ' });

      },
      error: (err) => console.log(err)
    });
  }

 async onBranchAdded() {
   
  this.branchesService.GetAllBranches().subscribe({
    next: (data) => {
      
      this.Branches = data as IBranch[];
      this.DialogId=0;
    },
    error: (err) => console.log(err)
  });
  }



  onSwitchChange(event: any,id:number) {
    console.log('Switch state:', event.checked);
    this.branchesService.ChangeStatus(id).subscribe({
      next:(data)=>{
        console.log(data);
        this.messageService.add({ severity: 'info', summary: 'تم الحفظ', detail: 'تم تعديل الحالة ' });
      },
      error:(err)=>{console.log(err)
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء التعديل' });

      }
    })
  }

 
}
