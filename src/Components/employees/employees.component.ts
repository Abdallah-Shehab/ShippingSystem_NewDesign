import { Table } from 'primeng/table';
import { EmployeeService } from '../../Services/employee.service';
 
import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { GlobalService } from '../../Services/global.service';
import { SharedModule } from '../../shared/shared.module';
 
@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [SharedModule,RouterLink],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {
  Employees:any=[];

  representatives:any=[];



  loading: boolean = false;
  @ViewChild('dt2') dt2!: Table;
  searchValue: string | undefined;



  permissions:any =[];
 constructor(public EmpService:EmployeeService,private messageService:MessageService,    private globalService:GlobalService) {
 
 }
 
 ngOnInit() {
  this.GetAll();
  this.globalService.loadGlobalData().then((permissions) => {
    this.permissions = this.globalService.getEntitiesPermissions(permissions,"الموظفين");
    console.log(this.permissions)
        
      }).catch((error) => {
        console.error('Error loading permissions:', error);
      });
 
 

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


  GetAll(){
    this.EmpService.getAllEmployees().subscribe({
      next: (data)=>{console.log(data); this.Employees=data},
      error:(err)=>console.log(err)
    })   
  }


  onSwitchChange(event: any,id:number) {
    console.log('Switch state:', event.checked);
    this.EmpService.updateEmployeeStatus(id).subscribe({
      next:(data)=>{
        console.log(data);
        this.messageService.add({ severity: 'info', summary: 'تم الحفظ', detail: 'تم تعديل الحالة ' });
      },
      error:(err)=>{console.log(err)
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء التعديل' });

      }
    })
  }

  Delete(id:number){
    this.EmpService.deleteEmployee(id).subscribe({
      next:(data)=>console.log(data),
      error:(err)=>{console.log(err);
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الحذف' });

      },
      complete: ()=>{
        this.Employees=this.Employees.filter((e:any)=>e.id!=id)
        this.messageService.add({ severity: 'info', summary: 'تم الحفظ', detail: 'تم حذف الموظف ' });

      }
        
    })
  }

 
}
