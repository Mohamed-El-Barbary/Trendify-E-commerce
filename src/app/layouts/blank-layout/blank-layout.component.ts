import { Component, ElementRef, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterModule } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-blank-layout',
  imports: [NavbarComponent, RouterModule, FooterComponent],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.scss'
})
export class BlankLayoutComponent {
 

  


}
