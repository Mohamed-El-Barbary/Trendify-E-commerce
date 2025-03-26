import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataViewModule } from 'primeng/dataview';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IWishlist } from '../../shared/interfaces/iwishlist';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink, DataViewModule, CurrencyPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);
  isLoadingRemove: { [key: string]: WritableSignal<boolean> } = {};
  isWishlistEmpty: WritableSignal<boolean> = signal(false);
  wishList: IWishlist | null = null;

  ngOnInit(): void {
    this.getWishListProduct();
  }

  getWishListProduct(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        if ((res.status = 'success')) {
          console.log('product wishlist', res);
          this.wishList = res;
          this.wishlistService.wishListNumber.set(res.data.length);
        }
        this.isWishlistEmpty.set(true)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addProductToCart(id: string): any {
    return this.cartService.addProductToCart(id);
  }

  removeProductWishlist(id: string): void {
    this.isLoadingRemove[id] = signal(true);
    this.wishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          console.log(res);
          this.getWishListProduct();
          this.toastrService.success(res.message, 'WishList');
        }
        this.isLoadingRemove[id] = signal(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoadingRemove[id] = signal(false);
      },
    });
  }

  get cartLoading(): {
    cartLoading: Record<string, boolean>;
    cartMainItemLoading: boolean;
  } {
    return {
      cartLoading: this.cartService.cartLoading,
      cartMainItemLoading: this.cartService.cartMainItemLoading,
    };
  }
}
