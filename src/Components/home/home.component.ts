import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../Services/global.service';
import { OrderServiceService } from '../../Services/order-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit  {

  global:any;
  orders:any[]=[]
  constructor(private globalService:GlobalService,private orderService:OrderServiceService) {
    
  this.global=this.globalService.globalVariable;  
  console.log(this.global.id)
  console.log(this.global.roleName)
  }
  ngOnInit(): void {
    if(this.global.roleName=='مندوب'){
      this.orderService.getAllOrdersForDelivery(Number(this.global.id)).subscribe({
        next:(data:any)=>{
          this.orders=data;
          console.log(this.orders)
        },
        error:(err)=>console.log(err)
      })
    }else if(this.global.roleName=='تاجر'){
      this.orderService.getAllOrdersForMercahnt(Number(this.global.id)).subscribe({
        next:(data:any)=>{
          this.orders=data;
          console.log(this.orders)
        },
        error:(err)=>console.log(err)
      })
    }
  }

}
