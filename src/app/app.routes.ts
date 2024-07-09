import { isLoginGuard } from './../Guards/is-login.guard';
import { LayoutComponent } from './../Components/Layout/layout.component';
import { Routes } from '@angular/router';
import { HomeComponent } from '../Components/home/home.component';
import { LoginComponent } from '../Components/login/login.component';
import { RolesComponent } from '../Components/roles/roles.component';
import { PermissionsComponent } from '../Components/roles/permissions/permissions.component';
import { OrdersComponent } from '../Components/Order/orders.component';
import { OrderFormComponent } from '../Components/Order/order-form/order-form.component';
import { ReportsComponent } from '../Components/reports/reports.component';
import { adminGuard } from '../Guards/admin.guard';
import { EmployeesComponent } from '../Components/employees/employees.component';
import { MerchantAccountsComponent } from '../Components/MercgentAccount/merchant-accounts/merchant-accounts.component';
import { DeliveryAccountsComponent } from '../Components/DeliveryAccounts/delivery-accounts/delivery-accounts.component';
import { UpdateDeliveryAccountComponent } from '../Components/DeliveryAccounts/updatedeliveryaccount/updatedeliveryaccount.component';
import { AddMerchantAccountComponent } from '../Components/MercgentAccount/add-merchant-account/add-merchant-account.component';
import { UpdateMerchantAccountComponent } from '../Components/MercgentAccount/update-merchant-account/update-merchant-account.component';
import { AddDeliveryAcountComponent } from '../Components/DeliveryAccounts/add-delivery-acount/add-delivery-acount.component';
import { EmployeeFormComponent } from '../Components/employees/employee-form/employee-form.component';
import { BranchesComponent } from '../Components/branches/branches.component';
import { GovernmentsComponent } from '../Components/governments/governments.component';
import { CitiesComponent } from '../Components/cities/cities.component';
import { NotFoundComponent } from '../Components/not-found/not-found.component';
 

export const routes: Routes = [
    {path:'login',component:LoginComponent},
{path:'',component:LayoutComponent,canActivate: [isLoginGuard],children: [
    {path:'',component:HomeComponent},
  
    {path:'orders',component:OrdersComponent},  //,canActivate:[adminGuard,deliveryGuard]
    {path:'orders/addorder',component:OrderFormComponent},  //,canActivate:[merchantGuard]
    {path:'report',component:ReportsComponent},
    
    {path:'roles',component:RolesComponent,canActivate: [adminGuard]},
    {path:'roles/permissions/:id',component:PermissionsComponent,canActivate: [adminGuard]},

    {path:'employee',component:EmployeesComponent , canActivate: [adminGuard]},
    {path:'MerchantAccounts',component:MerchantAccountsComponent, canActivate: [adminGuard]},
    {path:'DeliveryAccounts',component:DeliveryAccountsComponent , canActivate: [adminGuard]},
    
    {path:'DeliveryAccounts/UpdateDeliveryAccount/:id', component:UpdateDeliveryAccountComponent ,canActivate: [adminGuard]},
    {path:'DeliveryAccounts/AddDeliveryAccount' ,component:AddDeliveryAcountComponent,canActivate: [adminGuard]},
    {path:'MerchantAccounts/AddMerchantAccount' ,component:AddMerchantAccountComponent,canActivate: [adminGuard]},
    {path:'MerchantAccounts/UpdateMerchantAccount/:id', component:UpdateMerchantAccountComponent ,canActivate: [adminGuard]},
    
    {path:'employee/:id',component:EmployeeFormComponent},
    {path:'Branches' ,component:BranchesComponent},
    {path:'Governments' ,component:GovernmentsComponent},
  
    {path:'Cities' ,component:CitiesComponent},
]},
{path:'**',component:NotFoundComponent}
 
];
