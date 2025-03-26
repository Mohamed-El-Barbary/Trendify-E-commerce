import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    BreadcrumbModule,
    RouterModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  ngOnInit() {
    this.items = [
      { label: 'Home', route: '/home' },
      { label: 'Category', route: '/category' },
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
}
