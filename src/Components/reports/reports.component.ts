import { Component, OnInit, ViewChild } from '@angular/core';
 
import { OrderServiceService } from '../../Services/order-service.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../Services/global.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [SharedModule,CalendarModule,FormsModule ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {

  Orders:any=[];
  loading: boolean = true;
  @ViewChild('dt2') dt2!: Table;
  searchValue: string | undefined;
  filteredOrders:any =[];
  rangeDates: Date[] | undefined;
  date: string ='';
  statuses: { label: string; value: string }[] = [];
  constructor(private orderService:OrderServiceService,private messageService:MessageService,    private globalService:GlobalService) {
    
    
  }

  ngOnInit(): void {

this.GetAllOrders();
this.GetallStatuses();
 

this.globalService.loadGlobalData().then((permissions) => {
  this.permissions = this.globalService.getEntitiesPermissions(permissions,"التقارير");
  console.log(this.permissions)
      
    }).catch((error) => {
      console.error('Error loading permissions:', error);
    });
 
  }
  permissions:any =[];
 

  startDate: string = '';
  endDate: string = '';
  
  
 
  filterOrdersByDateRange() {
  
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      this.filteredOrders = this.Orders.filter((order:any) => {
        const orderDate = new Date(order.createdDate);
        return orderDate >= start && orderDate <= end;
      });
      console.log(this.filteredOrders)
    } else {
      this.filteredOrders = this.Orders;
    }
    
  }

  GetAllOrders() {
    this.orderService.getAllOrders().subscribe({
      next:(data)=>{this.Orders=data ; 
        this.filteredOrders=data;
        
        console.log(data)},
      error:(err)=>{console.log(err);this.loading=false},
      complete: ()=>this.loading=false
    })
  }

  GetallStatuses(){
    this.orderService.getAllOrderStatuses().subscribe({
      next:(data:any)=>{
        this.statuses = data.map((status:any) => ({
          label: status,
          value: status.toLowerCase().replace(/\s+/g, '')
        }));
      },
      error:(err)=>console.log(err),
    })
  }
  clear(table: Table) {
    table.clear();
    this.searchValue="";
}

onInput(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  if (this.dt2) {
    this.dt2.filterGlobal(inputElement.value, 'contains');
  }
}

}
