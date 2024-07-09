import { Table } from 'primeng/table';
 
  import { Component, ViewChild } from '@angular/core';
  
  import { DialogComponent } from './dialog/dialog.component';
  import { RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { BrowserModule } from '@angular/platform-browser';
  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
  import { MessageService } from 'primeng/api';
import { IcityID } from '../../Models/icity-id';
import { CityService } from '../../Services/city.service';
import { GlobalService } from '../../Services/global.service';
import { SharedModule } from '../../shared/shared.module';
  

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [SharedModule,DialogComponent,RouterLink,CommonModule ],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css'
})
export class CitiesComponent {

  
    Cities!: IcityID[];
    DialogId = 0;
    loading = true;
    @ViewChild('dt2') dt2!: Table;
    searchValue: string | undefined;
    permissions:any =[];
    constructor(public cityService: CityService,
      private messageService: MessageService,
          private globalService:GlobalService) {

  
    }
  
    ngOnInit() {
      this.GetAll();
      this.globalService.loadGlobalData().then((permissions) => {
        this.permissions = this.globalService.getEntitiesPermissions(permissions,"المدن");
        console.log(this.permissions)
            
          }).catch((error) => {
            console.error('Error loading permissions:', error);
          });
  
    }
    changeIdVal(id:number){
      this.DialogId=id;
    }
    clear(table: Table) {
      table.clear();
      this.searchValue = "";
    }
  
    onInput(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      if (this.dt2) {
        this.dt2.filterGlobal(inputElement.value, 'contains');
      }
    }
  
    GetAll() {
      this.cityService.GetAllCities().subscribe({
        next: (data) => {
          
          this.Cities = data as IcityID[];
          this.loading=false;
        },
        error: (err) => this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'لا يوجد مدينة' })
  
      });
    }
  
    Delete(id: number) {
      this.cityService.DeleteCity(id).subscribe({
        next: (data: any) => {
          console.log(data);
          this.Cities = this.Cities.filter((i: any) => i.id !== id);
          this.messageService.add({ severity: 'error', summary: 'تم الحذف', detail: 'تم حذف المدينة ' });
  
        },
        error: (err) => console.log(err)
      });
    }
  
   async onCityAdded() {
     
    this.cityService.GetAllCities().subscribe({
      next: (data) => {
        
        this.Cities = data as IcityID[];
        this.DialogId=0;
      },
      error: (err) => console.log(err)
    });
    }
  
  
  
    onSwitchChange(event: any,id:number) {
      console.log('Switch state:', event.checked);
      this.cityService.ChangeStatus(id).subscribe({
        next:(data)=>{
          this.messageService.add({ severity: 'info', summary: 'تم الحفظ', detail: 'تم تعديل الحالة ' });
        },
        error:(err)=>{console.log(err)
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء التعديل' });
  
        }
      })
    }
   
  }
  

 

