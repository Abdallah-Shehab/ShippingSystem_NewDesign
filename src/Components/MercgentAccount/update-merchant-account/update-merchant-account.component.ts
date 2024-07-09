import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MerchantService } from '../../../Services/merchant.service';

@Component({
  selector: 'app-update-merchant-account',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,ReactiveFormsModule,CommonModule],
  templateUrl: './update-merchant-account.component.html',
  styleUrl: './update-merchant-account.component.css'
})



export class UpdateMerchantAccountComponent implements OnInit {
  merchantForm: FormGroup;
  merchantId: number;
  specialOffers: FormArray;
  branches: any[] = [];
  cities: any[] = [];
  governments: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private merchantService: MerchantService
  ) {
    this.merchantForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      branchId: ['', Validators.required],
      city: ['', Validators.required],
      government: ['', Validators.required],
      rejectOrderPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      storeName: ['', Validators.required],
      pickupCost: ['', [Validators.required, Validators.min(0)]],
      specialOffers: this.fb.array([])
    });
    this.specialOffers = this.merchantForm.get('specialOffers') as FormArray;
    this.merchantId = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadMerchantData();
    this.loadBranches();
    this.loadCities();
    this.loadGovernments();
    this.merchantForm.get('password')?.disable();
  }

  loadMerchantData(): void {
    this.merchantService.getMerchantAccountById(this.merchantId).subscribe({
      next: (merchant) => {
        this.merchantForm.patchValue({
          password: merchant.passwordHash,
          email: merchant.email,
          name: merchant.name,
          address: merchant.address,
          phone: merchant.phone,
          branchId: merchant.branchID,
          city: merchant.city,
          government: merchant.government,
          refund_Percentage: merchant.refund_Percentage,
          storeName: merchant.storeName,
          pickup_Price: merchant.pickup_Price
        });
        this.loadSpecialOffers(merchant.id);
      },
      error: (error) => {
        console.error('Error loading merchant data:', error);
      }
    });
  }

  loadSpecialOffers(merchantId: number): void {
    this.merchantService.getSpecialOffersByMerchantId(merchantId).subscribe({
      next: (offers) => {
        this.specialOffers.clear();
        offers.forEach((offer: any) => {
          this.specialOffers.push(this.createOfferFormGroup(offer));
        });
      },
      error: (error) => {
        console.error('Error loading special offers:', error);
      }
    });
  }

  createOfferFormGroup(offerData: any): FormGroup {
    return this.fb.group({
      government: [offerData.government, Validators.required],
      city: [offerData.city, Validators.required],
      price: [offerData.deliveryPrice, Validators.required]
    });
  }

  addNewOffer(): void {
    this.specialOffers.push(this.createOfferFormGroup({ government: '', city: '', price: 0 }));
  }

  removeOffer(index: number): void {
    this.specialOffers.removeAt(index);
  }

  loadBranches() {
    this.merchantService.getBranches().subscribe(
      (data) => {
        this.branches = data;
      },
      (error) => {
        console.error('Error loading branches data:', error);
      }
    );
  }

  loadCities() {
    this.merchantService.getCities().subscribe(
      (data) => {
        this.cities = data;
      },
      (error) => {
        console.error('Error loading cities data:', error);
      }
    );
  }

  loadGovernments() {
    this.merchantService.getGovernments().subscribe(
      (data) => {
        this.governments = data;
      },
      (error) => {
        console.error('Error loading governments data:', error);
      }
    );
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
    }, 1000); 
  }


  EnablePassword(event:any){
    console.log(event.target.checked)
    if(event.target.checked){
      this.merchantForm.get('password')?.enable();
    }else{
      this.merchantForm.get('password')?.disable();

    }
    
  }
  onSubmit(): void {
    if (this.merchantForm.valid) {
      this.merchantService.updateMerchantAccount(this.merchantId, this.merchantForm.value).subscribe({
        next: (response) => {
          this.displayTemporaryMessage('تم التعديل بنجاح');
          setTimeout(() => {
            this.router.navigate(['/MerchantAccounts']);
          }, 1000);
        },
        error: (error) => {
          this.displayTemporaryMessage('تم التعديل بنجاح');
          setTimeout(() => {
            this.router.navigate(['/MerchantAccounts']);
          }, 1000);
        }
      });
    } else {
      alert('هناك خطأ في تعبئة النموذج. يرجى التحقق من الحقول المدخلة.');
    }
  }
}