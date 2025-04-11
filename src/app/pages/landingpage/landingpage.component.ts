import { ToastrService } from 'ngx-toastr';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatTabsModule } from '@angular/material/tabs';
import {
  Component,
  HostListener,
  inject,
  OnInit,
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
export class LandingpageComponent implements OnInit {
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

  ngOnInit(): void {
    setTimeout(() => {
      this.toastrService.error(
        'Please log in first to unlock the full experience!',
        'Access Denied',
        {
          positionClass: 'toast-top-center',
          timeOut: 60000,
        }
      );
    }, 5000);
  }

  toastrshow() {
    console.log('hallo');
    return this.toastrService.error(
      'Access Denied!',
      'Please log in to continue your Trendify experience.',
      { positionClass: 'toast-top-center' }
    );
  }
}
