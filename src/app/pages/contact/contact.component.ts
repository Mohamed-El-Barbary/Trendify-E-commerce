import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-contact',
  imports: [BreadcrumbModule, NgClass, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  links: MenuItem[] | undefined;

  ngOnInit(): void {
    this.links = [{ label: 'Home', route: '/home' }, { label: 'Contact Us' }];
  }
}
