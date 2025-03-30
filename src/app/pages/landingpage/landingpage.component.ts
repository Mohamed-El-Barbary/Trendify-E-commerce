import { ToastrService } from 'ngx-toastr';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatTabsModule } from '@angular/material/tabs';
import {
  Component,
  HostListener,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';


@Component({
  selector: 'app-landingpage',
  imports: [TabsModule, CommonModule, CarouselModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LandingpageComponent {
  private readonly toastrService = inject(ToastrService);

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    nav: true,
    dots: false,
    navSpeed: 700,
    navText: [
      "<i class='fa fa-chevron-left'></i>",
      "<i class='fa fa-chevron-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 2,
      },
      940: {
        items: 3,
      },
    },
  };

  toastrshow() {
    console.log('hallo');
    return this.toastrService.error(
      'Access Denied!',
      'Please log in to continue your Trendify experience.',
      { positionClass: 'toast-top-center' }
    );
  }
}
