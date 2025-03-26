import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-about-us',
  imports: [NgClass, RouterLink, BreadcrumbModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent implements OnInit {
  links: MenuItem[] | undefined;

  ngOnInit(): void {
    this.links = [{ label: 'Home', route: '/home' }, { label: 'About' }];
  }
}
