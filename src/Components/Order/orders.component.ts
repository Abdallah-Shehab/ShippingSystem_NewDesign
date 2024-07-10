import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
 
import { Table } from 'primeng/table';
import { OrderServiceService } from '../../Services/order-service.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogComponent } from './dialog/dialog.component';
import { PdfGeneratorService } from '../../Services/pdf-generator.service';
import { GlobalService } from '../../Services/global.service';
import { SharedModule } from '../../shared/shared.module';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DeliveryDialogComponent } from './DeliveryDialog/Deliverydialog.component';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

 
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [SharedModule,RouterLink,DialogComponent,DeliveryDialogComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})

export class OrdersComponent implements OnInit  {



  Orders:any=[];
  loading: boolean = true;
  @ViewChild('tableRow', { static: false }) tableRow!: ElementRef;
  @ViewChild('dt2') dt2!: Table;
  searchValue: string | undefined;
  orderId:number = 0;
 

  permissions:any =[];
RoleName :string =''
 
 

  statuses: { label: string; value: string }[] = [];
  constructor(private orderService:OrderServiceService,
              private messageService:MessageService,
              private globalService:GlobalService,
              private pdfService: PdfGeneratorService,
              private activeRoute:ActivatedRoute
            ) {
 
         
       

  }
  

  ngOnInit(): void {
this.GetAll();
  
    this.getStatuses();
 

    this.globalService.loadGlobalData().then((permissions) => {
      this.permissions = this.globalService.getEntitiesPermissions(permissions,"الطلبات");
    this.RoleName=this.globalService.globalVariable.roleName;

  
        }).catch((error) => {
          console.error('Error loading permissions:', error);
        });
  
 
   
  }



GetAll(){
   
  Number(this.globalService.globalVariable.id)
  if(this.globalService.globalVariable.roleName=="تاجر"){
    this.orderService.getAllOrdersForMercahnt( Number(this.globalService.globalVariable.id)).subscribe({
      next:(data)=>{this.Orders=data ;},
      error:(err)=>{console.log(err); this.loading=false},
      complete: ()=>this.loading=false
    })
  }else if(this.globalService.globalVariable.roleName=="مندوب"){
    this.orderService.getAllOrdersForDelivery( Number(this.globalService.globalVariable.id)).subscribe({
      next:(data)=>{this.Orders=data ;},
      error:(err)=>{console.log(err); this.loading=false},
      complete: ()=>this.loading=false
    })
  }else{
    this.orderService.getAllOrdersForDelivery( 0).subscribe({
      next:(data)=>{this.Orders=data ;},
      error:(err)=>{console.log(err); this.loading=false},
      complete: ()=>this.loading=false
    })
  }



}

getStatuses(){
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


  printTableRowAsPdf() {
    const rowElement = this.tableRow.nativeElement;
    this.pdfService.generatePdfFromTableRow(rowElement);
  }


  changeIdStatus(id:number){
    this.orderId = id;
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
Delete(id:number){
this.orderService.deleteOrder(id).subscribe({
  next:(data)=>console.log(data),
  error:(err)=>{console.log(err);
    this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الحذف' });
  },
  complete:()=>{
    this.Orders=this.Orders.filter((e:any)=>e.id!=id)
        this.messageService.add({ severity: 'info', summary: 'تم الحفظ', detail: 'تم حذف الطلب ' });
  }
})
}

updateOrders(){
  this.orderService.getAllOrders().subscribe({
    next:(data)=>{this.Orders=data ; console.log(data)},
    error:(err)=>console.log(err),
    complete: ()=>this.loading=false
  })
}




exportPdf() {
  const doc = new jsPDF('l', 'mm', 'a4');

  const head = [['City', 'Client Name', 'Created Date', 'Delivery Name', 'Delivery Price', 'Email', 'Government', 'Merchant Name', 'Notes', 'Phone One', 'Phone Two', 'Status', 'Street And Village', 'Total Price', 'Total Weight']];

  autoTable(doc, { 
    head: head, 
    body: this.toPdfFormat(this.Orders), 
    didDrawCell: (data) => { }, 
  });

  doc.save('orders.pdf');
}

toPdfFormat(orders: any[]) {
  let data = [];
  for (var i = 0; i < orders.length; i++) {
    data.push([
      orders[i].city,
      orders[i].clientName,
      orders[i].createdDate,
      orders[i].deliveryName,
      orders[i].deliveryPrice,
      orders[i].email,
      orders[i].government,
      orders[i].merchantName,
      orders[i].notes,
      orders[i].phoneOne,
      orders[i].phoneTwo,
      orders[i].status,
      orders[i].streetAndVillage,
      orders[i].totalPrice,
      orders[i].totalWeight
    ]);
  }
  return data;
}


printOrder(orderId: number) {
  const order = this.Orders.find((o:any) => o.id === orderId);
  if (!order) {
    console.error('Order not found!');
    return;
  }

  const doc = new jsPDF('l', 'mm', 'a4');

  const head = [['City', 'Client Name', 'Created Date', 'Delivery Name', 'Delivery Price', 'Email', 'Government', 'Merchant Name', 'Notes', 'Phone One', 'Phone Two', 'Status', 'Street And Village', 'Total Price', 'Total Weight']];

  autoTable(doc, { 
    head: head, 
    body: this.toPdfFormat([order]), 
    didDrawCell: (data) => { }, 
  });

  doc.save(`order_${orderId}.pdf`);
}

exportExcel() {
  const worksheet = XLSX.utils.json_to_sheet(this.Orders);
  const workbook = {
    Sheets: { data: worksheet },
    SheetNames: ['data']
  };
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });
  this.saveAsExcelFile(excelBuffer, 'orders');
}

private saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}

}
