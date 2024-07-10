import { Component, EventEmitter, Input, OnInit, Output, ViewChild,ElementRef, OnChanges, SimpleChanges  } from '@angular/core';
 
import { RolesService } from '../../../Services/roles.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { OrderServiceService } from '../../../Services/order-service.service';
import { SharedModule } from '../../../shared/shared.module';
import { DeliveryService } from '../../../Services/delivery.service';
declare var bootstrap: any;
@Component({
  selector: 'app-delivery-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './Deliverydialog.component.html',
  styleUrl: './Deliverydialog.component.css'
})
export class DeliveryDialogComponent implements OnInit  {
  @Input() id = 0;
  selectedDeliveryId: number=0;

 
  Title:string='';
  @Output() deliveryAssigned: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('deliveryModal') exampleModal!: ElementRef;
  status:any = "";
  deliveries:any=[];
  constructor(private orderservice: OrderServiceService, public router:Router,private messageService: MessageService,private deliveryAccounts:DeliveryService) {
  
  }
  

  
  ngOnInit() {
    this.deliveryAccounts.getDeliveryAccounts().subscribe({
      next:(data)=>{
    
        this.deliveries=data
      console.log(this.deliveries)
      },
      error:(error)=>console.log(error)
    })
 
  }

  DeliveryControl() {
    console.log(this.status.name)
      this.orderservice.AssignDelivery(this.id,this.selectedDeliveryId).subscribe({
       next:(data)=>{console.log(data);
        this.deliveryAssigned.emit();
        this.closeModal();
       },
       error:(error)=>console.log(error)

      })
   
  }

  onDeliveryChange(event: any) {
    console.log('Selected delivery ID:', this.selectedDeliveryId);
  }


  closeModal() {
    const modalElement = this.exampleModal.nativeElement;
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
   
 
    modal.hide();
  }
}
