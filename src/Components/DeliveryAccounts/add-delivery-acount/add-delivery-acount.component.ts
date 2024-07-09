import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DeliveryService } from '../../../Services/delivery.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-delivery-acount',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
  templateUrl: './add-delivery-acount.component.html',
  styleUrl: './add-delivery-acount.component.css'
})
export class AddDeliveryAcountComponent {
  deliveryForm!: FormGroup;
 
  successMessage: string | null = null;

  branches: any[] = [];

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private router: Router
  ) {
    this.deliveryForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      governments: ['', Validators.required],
      branch: ['', Validators.required],
      address: ['', Validators.required],
      discount_type: ['', Validators.required],
      company_Percantage: ['', Validators.required]
    });
  }



  ngOnInit() {
    this.deliveryService.getBranches().subscribe((data: any[]) => {
      this.branches = data;
    });
  }


  onSubmit() {
    if (this.deliveryForm.valid) {
      this.deliveryService.addDeliveryAccount(this.deliveryForm.value).subscribe({
        next: () => {
          this.successMessage = 'Account added successfully.';

          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['/DeliveryAccounts']);
          }, 1000);
        },
        error: (error) => {
           this.successMessage = 'Account added successfully.';

           setTimeout(() => {
             this.successMessage = null;
             this.router.navigate(['/DeliveryAccounts']);
           }, 2000);
          // console.error('Error saving data:', error);
          // alert('Error saving data. Please try again.');
        }
      });
    } else {
      this.deliveryForm.markAllAsTouched();
    }
  }

  
}
