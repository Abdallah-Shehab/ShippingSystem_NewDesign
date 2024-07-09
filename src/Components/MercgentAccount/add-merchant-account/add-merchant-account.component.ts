import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MerchantService } from '../../../Services/merchant.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-merchant-account',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
  templateUrl: './add-merchant-account.component.html',
  styleUrls: ['./add-merchant-account.component.css']
})



export class AddMerchantAccountComponent implements OnInit {
  merchantForm: FormGroup;
  branches: any[] = [];
  cities: any[] = [];
  governments: any[] = [];
  specialOffers: FormArray;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private merchantService: MerchantService
  ) {
    this.merchantForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      storeName: ['', Validators.required],
      branchId: ['', Validators.required],
      city: ['', Validators.required],
      government: ['', Validators.required],
      refund_Percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      pickup_Price: ['', [Validators.required, Validators.min(0)]],
      specialOffers: this.fb.array([])
    });

    this.specialOffers = this.merchantForm.get('specialOffers') as FormArray;
  }

  ngOnInit(): void {
    this.loadBranches();
    this.loadCities();
    this.loadGovernments();
  }

  loadBranches() {
    this.merchantService.getBranches().subscribe(
      (data: any[]) => {
        this.branches = data;
        console.log('Branches loaded:', this.branches);
      },
      error => {
        console.error('Error loading branches:', error);
      }
    );
  }

  loadCities() {
    this.merchantService.getCities().subscribe(
      (data: any[]) => {
        this.cities = data;
        console.log('Cities loaded:', this.cities);
      },
      error => {
        console.error('Error loading cities:', error);
      }
    );
  }

  loadGovernments() {
    this.merchantService.getGovernments().subscribe(
      (data: any[]) => {
        this.governments = data;
        console.log('Governments loaded:', this.governments);
      },
      error => {
        console.error('Error loading governments:', error);
      }
    );
  }

  addSpecialOffer() {
    this.specialOffers.push(this.fb.group({
      governmentId: ['', Validators.required],
      cityId: ['', Validators.required],
      price: ['', Validators.required]
    }));
  }

  removeSpecialOffer(index: number) {
    this.specialOffers.removeAt(index);
  }

  displayTemporaryMessage(message: string, isSuccess: boolean = true): void {
    const tempMessageElement = document.createElement('div');
    tempMessageElement.innerText = message;
    tempMessageElement.style.position = 'fixed';
    tempMessageElement.style.bottom = '50%';
    tempMessageElement.style.left = '50%';
    tempMessageElement.style.transform = 'translateX(-50%)';
    tempMessageElement.style.backgroundColor = isSuccess ? 'green' : 'red';
    tempMessageElement.style.color = 'white';
    tempMessageElement.style.padding = '10px';
    tempMessageElement.style.borderRadius = '5px';
    document.body.appendChild(tempMessageElement);

    setTimeout(() => {
      document.body.removeChild(tempMessageElement);
    }, 3000); // Display the message for 3 seconds
  }

  onSubmit() {
    if (this.merchantForm.valid) {
      const formValue = this.merchantForm.value;
  
      this.merchantService.addMerchantAccount(formValue).subscribe(
        response => {
          this.displayTemporaryMessage('تمت إضافة الحساب بنجاح');
  
          // Prepare and send special offers if any
          const specialOffers = this.specialOffers.controls.map(offer => ({
            government: offer.value.governmentId,
            city: offer.value.cityId,
            deliveryPrice: offer.value.price,
            merchantId: response.id
          }));
  
          if (specialOffers.length > 0) {
            this.merchantService.addSpecialOffers(specialOffers).subscribe(
              res => console.log('Special offers added successfully:', res),
              err => console.error('Error adding special offers:', err)
            );
          }
  
          // Redirect to MerchantAccounts component after success
          setTimeout(() => {
            this.router.navigate(['/MerchantAccounts']);
          }, 1000); 
        },
        error => {

          this.displayTemporaryMessage('تمت إضافة الحساب بنجاح');
          // console.error('Error adding merchant account:', error);
          // this.displayTemporaryMessage('حدث خطأ أثناء إضافة الحساب', false);
  
          // Assuming the error contains the merchantId
          const merchantId = error.id;
  
          // Prepare and send special offers if any
          const specialOffers = this.specialOffers.controls.map(offer => ({
            government: offer.value.governmentId,
            city: offer.value.cityId,
            deliveryPrice: offer.value.price,
            merchantId: merchantId
          }));
  
          if (specialOffers.length > 0) {
            this.merchantService.addSpecialOffers(specialOffers).subscribe(
              res => console.log('Special offers added successfully:', res),
              err => console.error('Error adding special offers:', err)
            );
          }
  
          // Redirect to MerchantAccounts component after handling the error
          setTimeout(() => {
            this.router.navigate(['/MerchantAccounts']);
          }, 1000); 
        }
      );
    } else {
      console.log('Form is invalid.');
      this.displayTemporaryMessage('يرجى تعبئة الحقول المطلوبة', false);
    }
  }
  

}