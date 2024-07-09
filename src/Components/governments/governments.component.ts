import { Table } from 'primeng/table';
 
 
import { Component, ViewChild } from '@angular/core';
import { GovernmentsService } from '../../Services/governments.service';

import { DialogComponent } from './dialog/dialog.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { IGovernment } from '../../Models/i-government';
import { GlobalService } from '../../Services/global.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-governments',
  standalone: true,
  imports: [SharedModule,
    DialogComponent,
    RouterLink,
    CommonModule ],
  templateUrl: './governments.component.html',
  styleUrl: './governments.component.css'
})
export class GovernmentsComponent {

  Governments!: IGovernment[];
  DialogId = 0;
  loading = true;
  @ViewChild('dt2') dt2!: Table;
  searchValue: string | undefined;

  permissions:any =[];
  constructor(public governmentsService: GovernmentsService,
    private messageService: MessageService,
        private globalService:GlobalService) {

 
  }

  ngOnInit() {
    this.GetAll();
    this.globalService.loadGlobalData().then((permissions) => {
      this.permissions = this.globalService.getEntitiesPermissions(permissions,"المحافظات");
          
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
    this.governmentsService.GetAllGovernments().subscribe({
      next: (data) => {
        
        this.Governments = data as IGovernment[];
        this.loading=false;
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'لا يوجد محافظات' })

    });
  }

  Delete(id: number) {
    this.governmentsService.DeleteGovernment(id).subscribe({
      next: (data: any) => {
        this.Governments = this.Governments.filter((i: any) => i.id !== id);
        this.messageService.add({ severity: 'error', summary: 'تم الحذف', detail: 'تم حذف المحافظة ' });

      },
      error: (err) => console.log(err)
    });
  }

 async onGovernmentAdded() {
   
  this.governmentsService.GetAllGovernments().subscribe({
    next: (data) => {
      
      this.Governments = data as IGovernment[];
      this.DialogId=0;
    },
    error: (err) => console.log(err)
  });
  }



  onSwitchChange(event: any,id:number) {
    console.log('Switch state:', event.checked);
    this.governmentsService.ChangeStatus(id).subscribe({
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
