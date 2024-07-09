import { Component, EventEmitter, Input, OnInit, Output, ViewChild,ElementRef, OnChanges, SimpleChanges  } from '@angular/core';
 
import { RolesService } from '../../../Services/roles.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { OrderServiceService } from '../../../Services/order-service.service';
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
  @Output() statusChanged: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('exampleModal') exampleModal!: ElementRef;
  status:any = "";
  OrderStatuses:any=[];
  constructor(private orderservice: OrderServiceService, public router:Router,private messageService: MessageService) {
  
  }
  

  
  ngOnInit() {
    this.orderservice.getAllOrderStatuses().subscribe({
      next:(data)=>{
    
        this.OrderStatuses=data},
      error:(error)=>console.log(error)
    })
 
  }

  StatusControl() {
    console.log(this.status.name)
      this.orderservice.updateOrderStatus(this.id,this.status).subscribe({
       next:(data)=>{console.log(data);
        this.statusChanged.emit();
        this.closeModal();
       },
       error:(error)=>console.log(error)

      })
   
  }


  closeModal() {
    const modalElement = this.exampleModal.nativeElement;
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
   
    console.log(this.id)
    modal.hide();
  }
}
