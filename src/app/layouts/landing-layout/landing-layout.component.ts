import {
  Component,
  ElementRef,
  QueryList,
  signal,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { LandingpageComponent } from '../../pages/landingpage/landingpage.component';

@Component({
  selector: 'app-landing-layout',
  imports: [NavbarComponent, FooterComponent, LandingpageComponent],
  templateUrl: './landing-layout.component.html',
  styleUrl: './landing-layout.component.scss',
})
export class LandingLayoutComponent {
  @ViewChildren('navLink', { read: ElementRef }) linkEl!: QueryList<ElementRef>;
  navlinks: WritableSignal<boolean> = signal(false);

  ngAfterViewInit(): void {
    const currentPath = window.location.pathname;
    this.changeHomeColor(currentPath);
  }

  changeHomeColor(path: string): void {
    this.linkEl.forEach((link) => {
      if (path === '/home') {
        link.nativeElement.style.color = 'white';
      } else {
        link.nativeElement.style.color = '';
      }
    });
  }

  showNavLinks() {
    this.navlinks.update((value) => !value);
    console.log(this.navlinks());
  }

  handleLinkClick(path: string): void {
    this.showNavLinks();
    this.changeHomeColor(path);
  }
  
}
