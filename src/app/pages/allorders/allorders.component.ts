import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { IUser } from '../../shared/interfaces/iuser';
import { OrdersService } from '../../core/services/orders/orders.service';
import { IOrders } from '../../shared/interfaces/iorders';
import { OrderListModule } from 'primeng/orderlist';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-allorders',
  imports: [
    OrderListModule,
    ButtonModule,
    BreadcrumbModule,
    NgClass,
    RouterLink,
  ],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss',
})
export class AllordersComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly ordersService = inject(OrdersService);
  private readonly wishlistService = inject(WishlistService);
  userDataId: IUser = {} as IUser;
  userOrderData: IOrders[] = [];
  latestOrder: IOrders | null = null;
  links: MenuItem[] | undefined;

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData(): void {
    this.getAllUserOrders();
    this.links = [{ label: 'Home', route: '/home' }, { label: 'All Orders' }];

    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlistService.wishListNumber.set(res.count);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  getAllUserOrders(): void {
    this.userDataId = this.authService.getUsersData();
    this.ordersService.getUserOrders(this.userDataId.id).subscribe({
      next: (res) => {
        console.log(res);
        this.userOrderData = [...res].reverse();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
