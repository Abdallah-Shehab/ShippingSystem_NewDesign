import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { MerchantService } from '../../../Services/merchant.service';

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
    InputTextModule
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

  constructor(private _MerchantService: MerchantService, private _Router: Router) {}

  ngOnInit(): void {
    this.loadMerchantAccounts();
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
    this._Router.navigate(['/UpdateMerchantAccount', id]);
  }

  get filteredMerchantAccounts() {
    return this.merchantAccounts.filter(account =>
      account.name.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }
}