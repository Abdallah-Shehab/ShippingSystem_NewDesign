import { Component, OnInit, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
 
import { Table   } from 'primeng/table';
 
import { DeliveryService } from '../../../Services/delivery.service';
 
import { GlobalService } from '../../../Services/global.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-delivery-accounts',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    SharedModule
  ],
  templateUrl: './delivery-accounts.component.html',
  styleUrls: ['./delivery-accounts.component.css']
})
export class DeliveryAccountsComponent implements OnInit {
  deliveryAccounts: any[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  first: number = 0;
  rows: number = 10;
  searchValue: string = '';

  

 
  @ViewChild('dt2') dt2!: Table;
 
  permissions:any =[];
  constructor(private _DeliveryService: DeliveryService, private _Router :Router,    private globalService:GlobalService) {

    
  }

  ngOnInit(): void {
    this.loadDeliveryAccounts();
    this.globalService.loadGlobalData().then((permissions) => {
      this.permissions = this.globalService.getEntitiesPermissions(permissions,"المندوبين");
      console.log(this.permissions)
          
        }).catch((error) => {
          console.error('Error loading permissions:', error);
        });
  
  }

  loadDeliveryAccounts(): void {
    this.loading = true;
    this._DeliveryService.getDeliveryAccounts().subscribe({
      next: (response:any) => {
        this.deliveryAccounts = response;
        this.totalRecords = this.deliveryAccounts.length; 
        this.loading = false;
      },
      error: (err:any) => {
        console.error('Error loading delivery accounts', err);
        this.loading = false;
      }
    });
  }

  onSwitchChange(event: any) {
    console.log('Switch state:', event.checked);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  onDeleteAccount(id: number) {
    this._DeliveryService.deleteDeliveryAccount(id).subscribe({
      next: (response) => {
        this.displayTemporaryMessage('Account deleted successfully.');
        this.loadDeliveryAccounts(); 
      },
      error: (error) => {
        this.displayTemporaryMessage('Account deleted successfully.');
        this.loadDeliveryAccounts(); 
        // console.error('Error deleting account:', error);
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
    this._Router.navigate(['DeliveryAccounts/UpdateDeliveryAccount', id]);
  }
  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (this.dt2) {
      this.dt2.filterGlobal(inputElement.value, 'contains');
    }
  }
  clear(table: Table) {
    table.clear();
    this.searchValue="";
}
}
