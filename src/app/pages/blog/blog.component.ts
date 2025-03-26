import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-blog',
  imports: [BreadcrumbModule, NgClass, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  links: MenuItem[] | undefined;

  ngOnInit(): void {
    this.links = [{ label: 'Home', route: '/home' }, { label: 'Blog' }];
  }
}
