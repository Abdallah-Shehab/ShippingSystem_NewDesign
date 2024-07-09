import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {  TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [],
  imports: [
    ToastModule,
    DialogModule,
    CommonModule,
    FormsModule,
    PanelModule,
    CardModule,
    ButtonModule,
 
    TableModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MultiSelectModule,
    DropdownModule,
    InputSwitchModule
  ], exports: [
    ToastModule,
    DialogModule,
    CommonModule,
    FormsModule,
    PanelModule,
    CardModule,
    ButtonModule,
    TableModule,
 
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MultiSelectModule,
    DropdownModule,
    InputSwitchModule
  ]
})
export class SharedModule { }
