import { Component, EventEmitter, Input, OnInit, Output, ViewChild,ElementRef, OnChanges, SimpleChanges  } from '@angular/core';
 
import { RolesService } from '../../../Services/roles.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedModule } from '../../../shared/shared.module';
declare var bootstrap: any;
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent implements OnInit  {
  @Input() id = 0;
  Title:string='';
  @Output() roleAdded: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('exampleModal') exampleModal!: ElementRef;
  roleName:string = "";

  constructor(private roleService: RolesService, public router:Router,private messageService: MessageService) {
  
  }
  

  
  ngOnInit() {
  
 
  }

  RoleControl() {
    if (this.id == 0) {
      this.roleService.AddRole(this.roleName).subscribe({
        next: (data) => {
          console.log('Role added:', data);
          this.roleAdded.emit();
          this.messageService.add({ severity: 'info', summary: 'تم الحفظ', detail: 'تم إضافة الصلاحية ' });

          this.closeModal();
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الحفظ' });
          
        },     complete:()=>{this.id=0,this.roleName=""}
      });
    } else {
      this.roleService.UpdateRole(this.id, this.roleName).subscribe({
        
        next: (data) => {
          console.log('Role Updated:', data);
        
          this.roleAdded.emit();
          this.messageService.add({ severity: 'warn', summary: 'تم الحفظ', detail: 'تم تعديل الصلاحية ' });

          this.closeModal();
        },
        error: (err) => {
          this.id==0;
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الحفظ' });

          console.log(err);
        },
        complete:()=>{this.id=0,this.roleName=""}
      });
    }
  }


  closeModal() {
    const modalElement = this.exampleModal.nativeElement;
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
   
    console.log(this.id)
    modal.hide();
  }
}
