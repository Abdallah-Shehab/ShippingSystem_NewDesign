import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DeliveryService } from '../../../Services/delivery.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-updatedeliveryaccount',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
  templateUrl: './updatedeliveryaccount.component.html',
  styleUrls: ['./updatedeliveryaccount.component.css']
})


export class UpdateDeliveryAccountComponent implements OnInit {
  deliveryForm: FormGroup;
  successMessage: string | null = null;
  accountId: number;
  branches: any[] = []; 
  accountBranchId: number = 0;

  discountTypeOptions = [
    { value: '1', label: 'نسبة مئوية' },
    { value: '2', label: 'قيمة' }
  
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private deliveryService: DeliveryService
  ) {
    this.deliveryForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      governments: ['', Validators.required],
      branch: ['', Validators.required],
      address: ['', Validators.required],
      discount_type: ['', Validators.required],
      company_Percantage: ['', Validators.required]
    });

    this.accountId = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadAccountData();
    this.loadBranches(); 
    this.deliveryForm.get('password')?.disable();
  }

  loadAccountData(): void {
    this.deliveryService.getDeliveryAccountById(this.accountId).subscribe({
      next: (account) => {
        this.accountBranchId = account.branchID; 
        this.deliveryForm.patchValue({
          password: account.passwordHash,
          email: account.email,
          userName: account.userName,
          phone: account.phoneNumber,
          governments: account.governments,
          branch: account.branchID, 
          address: account.address,
          discount_type: account.discount_type,
          company_Percantage: account.company_Percantage
        });
      },
      error: (error) => {
        console.error('Error loading account data:', error);
      }
    });
  }

  loadBranches(): void {
    this.deliveryService.getBranches().subscribe({
      next: (branches) => {
        this.branches = branches; 
      },
      error: (error) => {
        console.error('Error loading branches:', error);
      }
    });
  }
  EnablePassword(event:any){
    console.log(event.target.checked)
    if(event.target.checked){
      this.deliveryForm.get('password')?.enable();
    }else{
      this.deliveryForm.get('password')?.disable();

    }
    
  }

  onSubmit(): void {
    console.log('Form Submitted', this.deliveryForm.value); // Add this line
    this.deliveryForm.get('password')?.enable();
    if (this.deliveryForm.valid) {
      this.deliveryService.updateDeliveryAccount(this.accountId, this.deliveryForm.value).subscribe({
        next: (response) => {
          console.log('Update successful', response); 
          this.successMessage = 'تم تحديث الحساب بنجاح.';
          setTimeout(() => {
            this.router.navigate(['/DeliveryAccounts']);
          }, 2000);
        },
        error: (error) => {

          console.log('Update successful', error); 
          this.successMessage = 'تم تحديث الحساب بنجاح.';
          setTimeout(() => {
            this.router.navigate(['/DeliveryAccounts']);
          }, 2000);

          // console.error('Error updating account:', error); // Uncomment this line
          // this.successMessage = 'تم تحديث الحساب بنجاح.';
          // setTimeout(() => {
          //   this.router.navigate(['/DeliveryAccounts']);
          // }, 2000);
        }
      });
    } else {
      console.log('Form is invalid', this.deliveryForm); 
    }
  }
}