import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { MerchantService } from '../../../Services/merchant.service';
 
import { GlobalService } from '../../../Services/global.service';
import { SharedModule } from '../../../shared/shared.module';


@Component({
  selector: 'app-merchant-accounts',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    InputSwitchModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    SharedModule
  ],

  templateUrl: './merchant-accounts.component.html',
  styleUrls: ['./merchant-accounts.component.css']
})
export class MerchantAccountsComponent implements OnInit {
  merchantAccounts: any[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  first: number = 0;
  rows: number = 10;
  searchValue: string = '';

  @ViewChild('dt2') dt2!: Table;
  permissions:any =[];
  constructor(private _MerchantService: MerchantService, private _Router: Router,    private globalService:GlobalService
  ) {
 
  }

  ngOnInit(): void {
    this.loadMerchantAccounts();
    this.globalService.loadGlobalData().then((permissions) => {
      this.permissions = this.globalService.getEntitiesPermissions(permissions,"التجار");
      console.log(this.permissions)
          
        }).catch((error) => {
          console.error('Error loading permissions:', error);
        });
 
  }

  loadMerchantAccounts(): void {
    this.loading = true;
    this._MerchantService.getMerchantAccounts().subscribe({
      next: (response: any) => {
        this.merchantAccounts = response;
        this.totalRecords = this.merchantAccounts.length;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading merchant accounts', err);
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  onDeleteAccount(id: number) {
    this._MerchantService.deleteMerchantAccount(id).subscribe({
      next: (response) => {
        this.displayTemporaryMessage('Account deleted successfully.');
        this.loadMerchantAccounts();
      },
      error: (error) => {
        this.displayTemporaryMessage('Account deleted successfully.');
        this.loadMerchantAccounts();
        // console.error('Error deleting account:', error);
        // this.displayTemporaryMessage('Error deleting account.');
      }
    });
  }

  displayTemporaryMessage(message: string): void {
    const tempMessageElement = document.createElement('div');
    tempMessageElement.innerText = message;
    tempMessageElement.style.position = 'fixed';
    tempMessageElement.style.bottom = '50%';
    tempMessageElement.style.left = '50%';
    tempMessageElement.style.transform = 'translateX(-50%)';
    tempMessageElement.style.backgroundColor = 'green';
    tempMessageElement.style.color = 'white';
    tempMessageElement.style.padding = '10px';
    tempMessageElement.style.borderRadius = '5px';
    document.body.appendChild(tempMessageElement);

    setTimeout(() => {
      document.body.removeChild(tempMessageElement);
    }, 1000);
  }

  onEditAccount(id: number): void {
    this._Router.navigate(['MerchantAccounts/UpdateMerchantAccount', id]);
  }

  get filteredMerchantAccounts() {
    return this.merchantAccounts.filter(account =>
      account.name.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }

  clear(table: Table) {
    table.clear();
    this.searchValue="";
}

onInput(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  if (this.dt2) {
    this.dt2.filterGlobal(inputElement.value, 'contains');
  }
}
onSwitchChange(event: any,id:number) {
  console.log('Switch state:', event.checked);
  // this.EmpService.updateEmployeeStatus(id).subscribe({
  //   next:(data)=>{
  //     console.log(data);
  //     this.messageService.add({ severity: 'info', summary: 'تم الحفظ', detail: 'تم تعديل الحالة ' });
  //   },
  //   error:(err)=>{console.log(err)
  //     this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء التعديل' });

  //   }
  // })
}

Delete(id:number){
  // this.EmpService.deleteEmployee(id).subscribe({
  //   next:(data)=>console.log(data),
  //   error:(err)=>{console.log(err);
  //     this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الحذف' });

  //   },
  //   complete: ()=>{
  //     this.Employees=this.Employees.filter((e:any)=>e.id!=id)
  //     this.messageService.add({ severity: 'info', summary: 'تم الحفظ', detail: 'تم حذف الموظف ' });

  //   }
      
  // })
}

}
