import { Component, EventEmitter, Input, OnInit, Output, ViewChild,ElementRef, OnChanges, SimpleChanges  } from '@angular/core';
 
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GovernmentsService } from '../../../Services/governments.service';
import { IGovernment } from '../../../Models/i-government';
import { FormsModule } from '@angular/forms';
import { IcityID } from '../../../Models/icity-id';
import { CityService } from '../../../Services/city.service';
import { IgovernmentID } from '../../../Models/igovernment-id';
import { SharedModule } from '../../../shared/shared.module';
declare var bootstrap: any;
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [SharedModule,FormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent implements OnChanges ,OnInit{
  @Input() id = 0;
  Title:string='';
  @Output() cityAdded: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('exampleModal') exampleModal!: ElementRef;
  cityObj:IcityID={name:"",status:true,id:0,governmentID:0,normalShippingCost:0,pickupShippingCost:0};
  governments!:IGovernment[];
  isValid:boolean=true;
  constructor(private cityService: CityService,private governmetnService :GovernmentsService, public router:Router,private messageService: MessageService) {
  
  }
  ngOnInit() {
    this.governmetnService.GetAllGovernments().subscribe({
      next: (data) => {
        this.governments = data as IGovernment[];
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'لا يوجد محافظات' });

      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.id != 0){
      this.cityService.GetByID(this.id).subscribe({
        next: (data) => {
          this.cityObj=data;          
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ ، حاول مره اخرى' });
        }
      });
    }
  }



  CityControl() {

    console.log("name "+this.cityObj.name);
    console.log("normal "+this.cityObj.normalShippingCost);
    console.log("pickup "+this.cityObj.pickupShippingCost);
    
    if(this.cityObj.name=="" || this.cityObj.normalShippingCost ==0 ||  this.cityObj.pickupShippingCost ==0){
      //validation on name input
     console.log("isValid false")
      this.isValid=false;
    }
    else{
      this.isValid=true;
      console.log("isValid true")

      if (this.id == 0) {
        console.log(this.cityObj)
        console.log("name2 "+this.cityObj.name);
    console.log("normal2 "+this.cityObj.normalShippingCost);
    console.log("pickup2 "+this.cityObj.pickupShippingCost);
        this.cityService.AddCity(this.cityObj).subscribe({
          next: (data) => {
            console.log('government added:', data);
            this.cityAdded.emit();
            this.messageService.add({ severity: 'success', summary: 'تم الحفظ', detail: 'تم إضافة المدينة ' });
  
            this.closeModal();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الحفظ' });
            
          },     complete:()=>{this.id=0,this.cityObj.name="",this.cityObj.id=0}
        });
      } else {
        this.cityService.UpdateCity(this.id, this.cityObj).subscribe({
          
          next: (data) => {
            console.log('city Updated:', data);
          
            this.cityAdded.emit();
            this.messageService.add({ severity: 'success', summary: 'تم الحفظ', detail: 'تم تعديل المدينة ' });
  
            this.closeModal();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الحفظ' });
  
            console.log(err);
          },
          complete:()=>{this.id=0,this.cityObj.name="",this.cityObj.id=0}
        });
      }
    }
    
  }

  resetForm() {
    this.isValid=true;
    this.id= 0;
    this.cityObj = {
      name: '',
      status:true,
      id: 1,
      governmentID:1,
      normalShippingCost:0,//here i want to edite that 
      pickupShippingCost:0//here i want to edite that 
    };
  }
  closeModal() {
    const modalElement = this.exampleModal.nativeElement;
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
   
    console.log(this.id)
    modal.hide();
  }
}
;