import { Component, EventEmitter, Input, OnInit, Output, ViewChild,ElementRef, OnChanges, SimpleChanges  } from '@angular/core';
 
import { BranchesService } from '../../../Services/branches.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { IBranch } from '../../../Models/i-branch';
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
export class DialogComponent implements OnInit ,OnChanges {
  @Input() id = 0;
  Title:string='';
  @Output() branchAdded: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('exampleModal') exampleModal!: ElementRef;
  branchObj:IBranch={name:"",status:true,governmentID:0};
  @Input() governments!:IGovernment[];

  isValid:boolean=true;

  constructor(private branchService: BranchesService,
     private governmentService:GovernmentsService,
      public router:Router,
      private messageService: MessageService) {
  
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.id != 0){
      this.branchService.GetByID(this.id).subscribe({
        next: (data) => {
          this.branchObj=data;
          
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ ، حاول مره اخرى' });

        }
      });
    }
  }
  LoadGovernatorsNoBranches(){
    this.governmentService.GetAllGovernmentsNoBranches().subscribe({
      next: (data) => {
        this.governments = data as IGovernment[];
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'لا يوجد محافظات' });

      }
    });
  }
  LoadALLGovernators(){
    this.governmentService.GetAllGovernments().subscribe({
      next: (data) => {
        this.governments = data as IGovernment[];
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'لا يوجد محافظات' });

      }
    });
  }
  
  ngOnInit() {
    if(this.id!=0){
      this.LoadALLGovernators();
    }else{
      this.LoadGovernatorsNoBranches();

    }
  }

  branchControl() {
    if(this.branchObj.name==""){
      //validation on name input
      this.isValid=false;
    }
    else{
      this.isValid=true;

      if (this.id == 0) {
        this.branchService.AddBranch(this.branchObj).subscribe({
          next: (data) => {
            this.branchAdded.emit();
            this.messageService.add({ severity: 'success', summary: 'تم الحفظ', detail: 'تم إضافة الفرع ' });
  
            this.closeModal();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الحفظ' });
            
          },     complete:()=>{this.id=0,this.branchObj.name="",this.branchObj.governmentID=1}
        });
      } else {
        this.branchService.UpdateBranch(this.id, this.branchObj).subscribe({
          
          next: (data) => {
            this.branchAdded.emit();
            this.messageService.add({ severity: 'success', summary: 'تم الحفظ', detail: 'تم تعديل الفرع ' });
  
            this.closeModal();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الحفظ' });
          },
          complete:()=>{this.id=0,this.branchObj.name="",this.branchObj.governmentID=1}
        });
      }
    }
    
  }

  resetForm() {
    this.isValid=true;
    this.id= 0;
    this.branchObj = {
      name: '',
      status:true,
      governmentID: 0
    };
    if(this.id!=0){
      this.LoadALLGovernators();
    }else{

      this.LoadGovernatorsNoBranches();
    }
  }
  closeModal() {
    const modalElement = this.exampleModal.nativeElement;
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.hide();
  }
}
;