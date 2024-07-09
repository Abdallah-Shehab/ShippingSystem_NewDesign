import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { OrderServiceService } from '../../../Services/order-service.service';
import { MerchantService } from '../../../Services/merchant.service';
import { IgovernmentID } from '../../../Models/igovernment-id';
import { IcityID } from '../../../Models/icity-id';
import { IShippingTypeID } from '../../../Models/i-shipping-type-id';
import { IPaymentTypeID } from '../../../Models/i-payment-type-id';
import { IbranchID } from '../../../Models/ibranch-id';
import { IdeliveryType } from '../../../Models/idelivery-type';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InewOrder } from '../../../Models/inew-order';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { OrderRead } from '../../../Models/order-read';
import { GlobalService } from '../../../Services/global.service';
import { Imerchant } from '../../../Models/imerchant';
import { MessageService } from 'primeng/api';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
  standalone: true,
  imports: [
    InputSwitchModule,
    TableModule,
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    CardModule,
    SharedModule
  ]
})
export class OrderFormComponent implements OnInit {
  count: number = 1;
  newProducts: any[] = [];
  governments: IgovernmentID[] = [];
  cities: IcityID[] = [];
  deliveryTypes: IdeliveryType[] = [];
  shippingTypes: IShippingTypeID[] = [];
  paymentTypes: IPaymentTypeID[] = [];
  branches: IbranchID[] = [];
  orderForm: FormGroup;
  totalPriceOfProducts: number = 0;
  totalWeightProducts: number = 0;
  merchant!: Imerchant ;
  merchantID!: number ;
  order!: InewOrder;
  totalPriceDelivery!:number;
  totalPriceOrder!:number;
  countProducts!:number;
  dataDisplayInAleart!:OrderRead;
  constructor(private fb: FormBuilder,
    private messageService: MessageService, private orderService: OrderServiceService, private merchantService: MerchantService,private router:Router,private globalService:GlobalService) {
    this.orderForm = this.fb.group({
      clientName: ['', Validators.required],
     totalPrice: [{value: this.totalPriceOfProducts, disabled: true}, Validators.required],//===================
      totalWeight: [{value: this.totalWeightProducts, disabled: true}, Validators.required],
      phoneOne: ['', Validators.required],
      phoneTwo: [''],
      email: ['', [Validators.required, Validators.email]],
      notes: [''],
      streetAndVillage: [{ value: '', disabled: true } ],
      deliveryToVillage: [false],
      merchantID: [this.merchantID, Validators.required],
      shippingTypeID: ["default", [this.defaultSelectionValidator]],
      paymentTypeID: ["default", [this.defaultSelectionValidator]],
      branchID: ["default", [this.defaultSelectionValidator]],
      products: this.fb.array([]),
      governmentID: ["default", [this.defaultSelectionValidator]],
      cityID: ["default", [this.defaultSelectionValidator]],
      deliveryTypeID: ["default", [this.defaultSelectionValidator]],
      merchantPhone: [{value:'', disabled: true}, Validators.required],
      merchantAddress: [{value: '', disabled: true}, Validators.required],
    });

    this.merchantID=globalService.globalVariable.id;
    this.orderForm.patchValue({
     merchantID:this.merchantID, //sure this return merchant id
    });
    console.log("merchant ID "+this.merchantID);

    this.loadInitialData();
  }

  ngOnInit(): void {
    this.orderForm.get('governmentID')?.valueChanges.subscribe({
      next: governmentID => {
        if (governmentID) {
          this.loadCities(governmentID);
          this.orderForm.get('cityID')?.enable();
        } else {
          this.orderForm.get('cityID')?.disable();
          this.cities = [];
        }
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.orderForm.get('deliveryToVillage')?.valueChanges.subscribe(checked => {
      if (checked) {
        this.orderForm.get('streetAndVillage')?.enable();
      } else {
        this.orderForm.get('streetAndVillage')?.disable();
      }
    });
    console.log('try to get data for merchant ');
//===================================================================================================//
    this.merchantService.getMerchantAccountById(this.merchantID).subscribe({
      next: (data: any) => {
        console.log(data);
        this.merchant = data || {};
        this.updateMerchantData();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  
  @HostListener('mouseover', ['$event.target'])
  onMouseOver(target: EventTarget) {
    if ((target as HTMLElement).tagName === 'INPUT') {
      this.updateTotals();
    }
  }


  updateMerchantData(): void {
    this.orderForm.patchValue({
      merchantPhone: this.merchant.phoneNumber || '',
      merchantAddress: this.merchant.address || ''
    });
  }

  loadInitialData(): void {
    this.orderService.getAllGovernmentTocreateOrder().subscribe({
      next: (data: any) => {
        this.governments = data as IgovernmentID[];
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.orderService.getAllPaymentType().subscribe({
      next: (data: any) => {
        this.paymentTypes = data as IPaymentTypeID[];
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.orderService.getAllShippingType().subscribe({
      next: (data: any) => {
        this.shippingTypes = data as IShippingTypeID[];
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.orderService.getAllBranch().subscribe({
      next: (data: any) => {
        this.branches = data as IbranchID[];
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.orderService.getAllDeliveryTypes().subscribe({
      next: (data) => {
        this.deliveryTypes = data as IdeliveryType[];
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadCities(governmentID: number): void {
    this.orderService.getAllCitiesBasedOnGovernments(governmentID).subscribe({
      next: (data: any) => {
        this.cities = data as IcityID[];
        console.log('cities'+this.cities);
      },
      error: (error) => {
      }
    });
  }

  defaultSelectionValidator(control: AbstractControl) {
    return control.value === "default" ? { defaultSelected: true } : null;
  }

  addRow() {
    if (this.isProductValid()) {
      this.newProducts.push({ id: this.count++ });
      this.Products.push(this.createProductFormGroup());
      this.updateTotals();
    } else {
      this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'لا يوجد فروع' })
    //===================ask Abdallah===============================
    }
  }

  deleteRow(index: number) {
    this.newProducts.splice(index, 1);
    this.Products.removeAt(index);
    this.updateTotals();
  }

  isProductValid(): boolean {
    const productFormArray = this.Products as FormArray;
    if (productFormArray.length === 0) return true;

    const lastProduct = productFormArray.at(productFormArray.length - 1) as FormGroup;
    return lastProduct.valid;
  }

  updateTotals() {
    this.totalPriceOfProducts = 0;
    this.totalWeightProducts = 0;

    const productFormArray = this.Products as FormArray;

    productFormArray.controls.forEach((control: AbstractControl) => {
     //====================check to delete it ==========
      const price = (parseInt(control.get('price')?.value) || 0) * (parseInt(control.get('quantity')?.value) || 0) ;
      const weight = parseInt(control.get('weight')?.value, 10) || 0;
      this.totalPriceOfProducts += price;
      this.totalWeightProducts += weight;
    });

    this.orderForm.patchValue({
      totalPrice: this.totalPriceOfProducts,
      totalWeight: this.totalWeightProducts
    });
  }

  createProductFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      weight: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(1)]]
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  get Products(): FormArray {
    return this.orderForm.get('products') as FormArray;
  }

  AddNewOrder() {
    this.orderForm.markAllAsTouched();
   console.log(this.orderForm)

     // Temporarily enable the controls before reading the form values
  this.orderForm.get('totalPrice')?.enable();
  this.orderForm.get('totalWeight')?.enable();
  this.orderForm.get('streetAndVillage')?.enable();
    if (this.orderForm.valid) {
      this.order = this.orderForm.value as InewOrder;
      console.log(this.order);
      this.orderService.createOrder(this.order).subscribe({
        next: (data) => {
          this.dataDisplayInAleart = data as OrderRead;
          this.totalPriceDelivery=this.dataDisplayInAleart.deliveryPrice;
          this.totalPriceOrder=this.dataDisplayInAleart.paiedMoney;
          console.log("data when ");
          console.log(data);
          this.sweetaleart()
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      console.log('Form has validation errors:', this.orderForm);
    }
  }
//===========================Ask Abdallah
  sweetaleart(){
    Swal.fire({
      title: 'Order Added Successfull',
      text: `your price of order is ${this.totalPriceOrder} and price Delivery is ${this.totalPriceDelivery} `,
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'OK',
    }).then(() => {
      this.router.navigateByUrl('/orders');
    });
    
  }
}
