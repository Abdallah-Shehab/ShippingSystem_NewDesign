import { Component } from '@angular/core';
import { GlobalService } from '../../Services/global.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  global:any;
  constructor(private globalService:GlobalService) {
    
  this.global=this.globalService.globalVariable;  
  }

}
