import { Component, EventEmitter, Input, OnInit, Output, ViewChild,ElementRef, OnChanges, SimpleChanges  } from '@angular/core';
 
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GovernmentsService } from '../../../Services/governments.service';
import { IGovernment } from '../../../Models/i-government';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
declare var bootstrap: any;
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [SharedModule,FormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent implements OnChanges {
  @Input() id = 0;
  Title:string='';
  @Output() governmentAdded: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('exampleModal') exampleModal!: ElementRef;
  governmentObj:IGovernment={name:"",status:true,id:0};

  isValid:boolean=true;

  constructor(private governmentService: GovernmentsService, public router:Router,private messageService: MessageService) {
  
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.id != 0){
      this.governmentService.GetByID(this.id).subscribe({
        next: (data) => {
          this.governmentObj=data;          
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ ، حاول مره اخرى' });

        }
      });
    }
  }



  governmentControl() {
    if(this.governmentObj.name==""){
      //validation on name input
      this.isValid=false;
    }
    else{
      this.isValid=true;

      if (this.id == 0) {
        this.governmentService.AddGovernment(this.governmentObj).subscribe({
          next: (data) => {
            console.log('government added:', data);
            this.governmentAdded.emit();
            this.messageService.add({ severity: 'success', summary: 'تم الحفظ', detail: 'تم إضافة المحافظة ' });
  
            this.closeModal();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الحفظ' });
            
          },     complete:()=>{this.id=0,this.governmentObj.name="",this.governmentObj.id=0}
        });
      } else {
        this.governmentService.UpdateGovernment(this.id, this.governmentObj).subscribe({
          
          next: (data) => {
            console.log('government Updated:', data);
          
            this.governmentAdded.emit();
            this.messageService.add({ severity: 'success', summary: 'تم الحفظ', detail: 'تم تعديل المحافظة ' });
  
            this.closeModal();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الحفظ' });
  
            console.log(err);
          },
          complete:()=>{this.id=0,this.governmentObj.name="",this.governmentObj.id=0}
        });
      }
    }
    
  }

  resetForm() {
    this.isValid=true;
    this.id= 0;
    this.governmentObj = {
      name: '',
      status:true,
      id: 1
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