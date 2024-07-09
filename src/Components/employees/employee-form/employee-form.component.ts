import { Role } from './../../../Models/IRole';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
 
import { EmployeeService } from '../../../Services/employee.service';
import { MessageService } from 'primeng/api';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,SharedModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  EmployeeForm!: FormGroup ;
  branches:any= [];
 id:number =0;
  Roles:any= [];
   
  formGroup: FormGroup ;
  
  constructor( private fb: FormBuilder,private empService:EmployeeService,private router: Router,private activaetRoute:ActivatedRoute
    ,private messageService:MessageService
  ) {

      this.id = activaetRoute.snapshot.params['id'];
     console.log(this.id)
      this.EmployeeForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password:[Validators.required, Validators.minLength(8)],
        phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
        roleId: ['', Validators.required],
        branchId: ['', Validators.required],
        address: ['', Validators.required],
       
      });

      
      this.formGroup = new FormGroup({
        selectedCity: new FormControl(null)
      });
      if(this.id!=0){
        
        
        this.EmployeeForm.get('password')?.disable()
        this.empService.getEmployee(this.id).subscribe({
          next: (data:any)=>{console.log(data);
            this.EmployeeForm.patchValue(data);
          },
          error: (err)=>console.error(err)

        })
      }

  }
  ngOnInit(): void {
   
   if(this.id==0){
    this.EmployeeForm.get('password')?.setValue("");
   }

 

this.empService.GetBranches().subscribe({
  next: (data)=>this.branches=data,
  error: (err)=>console.error(err)
  
})

this.empService.GetAllRoles().subscribe({
  next: (data)=>this.Roles=data,
  error: (err)=>console.error(err)
  
})

  }

   EnablePassword(event:any){
    console.log(event.target.checked)
    if(event.target.checked){
      this.EmployeeForm.get('password')?.enable();
    }else{
      this.EmployeeForm.get('password')?.disable();

    }
    
  }

  save(){
    if(this.id==0){
      if(this.EmployeeForm.valid){
        this.empService.AddEmployee(this.EmployeeForm.value).subscribe({
          next: (data:any)=>{console.log(data); this.router.navigate(['/employee']);

        this.messageService.add({ severity: 'info', summary: 'تم الحفظ', detail: 'تم إضافة الموظف ' });

          },
          error: (err)=>{console.error(err);
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الإضافة' });

          }

        })
      }else {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ  تأكد من البيانات المدخلة' });

        console.log('Form is invalid', this.EmployeeForm); 
      }
    }else{
      this.EmployeeForm.get('password')?.enable();
      if(this.EmployeeForm.valid){
        this.empService.updateEmployee(this.id,this.EmployeeForm.value).subscribe({
          next: (data:any)=>{console.log(data);
        this.messageService.add({ severity: 'info', summary: 'تم الحفظ', detail: 'تم تعديل بيانات الموظف  ' });
        this.router.navigate(['/employee']);
           },
          error: (err)=>{console.error(err);
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء حفظ التعديل' });

          }

        })
      }else {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ  تأكد من البيانات المدخلة' });

        console.log('Form is invalid', this.EmployeeForm); 
      }
    }
    console.log(this.EmployeeForm.value);
  }

}
