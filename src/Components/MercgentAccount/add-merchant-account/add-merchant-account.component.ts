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
  mainForm: FormGroup;
  branches: any[] = [];
  cities: any[] = [];
  governments: any[] = [];
  specialOffers: FormArray;

  constructor(
    private fb: FormBuilder,
    private MerchantService: MerchantService,
    private router: Router
  ) {
    this.mainForm = this.fb.group({
      merchantForm: this.fb.group({
        password: ['',[ Validators.required , , Validators.minLength(8)]],
        email: ['', [Validators.required, Validators.email]],
        name: ['',[ Validators.required , Validators.minLength(3)]],
        address: ['', Validators.required],
        phone: ['',[ Validators.required , Validators.pattern(/^01[0125][0-9]{8}$/)]],
        branchId: ['', Validators.required],
        city: ['', Validators.required],
        government: ['', Validators.required],
        storeName: ['', Validators.required],
        refund_Percentage: ['', Validators.required],
        pickup_Price: ['', Validators.required]
      }),
      specialOffersForm: this.fb.group({
        specialOffers: this.fb.array([])
      })
    });

    this.specialOffers = this.mainForm.get('specialOffersForm.specialOffers') as FormArray;
  }

  ngOnInit(): void {
    this.getBranches();
    this.getCities();
    this.getGovernments();
  }

  getBranches() {
    this.MerchantService.getBranches().subscribe((response: any) => {
      this.branches = response;
    });
  }

  getCities() {
    this.MerchantService.getCities().subscribe((response: any) => {
      this.cities = response;
    });
  }

  getGovernments() {
    this.MerchantService.getGovernments().subscribe((response: any) => {
      this.governments = response;
    });
  }

  addSpecialOffer() {
    const specialOfferForm = this.fb.group({
      deliveryPrice: ['', Validators.required],
      city: ['', Validators.required],
      government: ['', Validators.required]
    });

    this.specialOffers.push(specialOfferForm);
  }

  removeSpecialOffer(index: number) {
    this.specialOffers.removeAt(index);
  }


  onSubmit() {
    if (this.mainForm.valid) {
      const merchantData = this.mainForm.value.merchantForm;
      const specialOffersData = this.mainForm.value.specialOffersForm.specialOffers;
  
      console.log("Form is valid. Sending data..."); // Debugging
      // Add both merchant and special offers
      this.MerchantService.addMerchantWithSpecialOffers(merchantData, specialOffersData).subscribe(response => {
        this.router.navigate(['/MerchantAccounts']);
      }, error => {
        console.error("Error occurred while saving data:", error);
      });
    } else {
      console.log("Form is invalid."); // Debugging
    }
  }
  

}