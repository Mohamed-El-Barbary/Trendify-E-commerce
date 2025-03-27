import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CartService } from './../../core/services/cart/cart.service';
import {
  Component,
  computed,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { ICart } from '../../shared/interfaces/icart';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../core/services/product/product.service';
import { IProuduct } from '../../shared/interfaces/iprouduct';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-cart',
  imports: [
    DataViewModule,
    ButtonModule,
    RouterLink,
    CurrencyPipe,
    BreadcrumbModule,
    NgClass,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);
  private readonly toastrService = inject(ToastrService);
  readonly wishlistService = inject(WishlistService);

  cartProducts: ICart = {} as ICart;
  similarProducts: IProuduct[] = [];
  isLoading: { [key: string]: WritableSignal<boolean> } = {};
  isLoadingRemove: { [key: string]: WritableSignal<boolean> } = {};
  removeAllItemLoading: WritableSignal<boolean> = signal(false);
  checkLoading: WritableSignal<boolean> = signal(false);
  totalCartPrice: WritableSignal<number> = signal(0);
  estimatedEndDate: WritableSignal<string> = signal('');
  isCartEmpty: WritableSignal<boolean> = signal(false);
  today: Date = new Date();
  links: MenuItem[] | undefined;
  numOfCartItems: Signal<number> = computed(() =>
    this.cartService.cartNumber()
  );

  ngOnInit() {
    this.initializeData();
  }

  initializeData(): void {
    this.getCartItems();
    this.calculateDeliveryDates();
    this.links = [
      { label: 'Home', route: '/home' },
      { label: 'Category', route: '/products' },
      { label: 'Cart' },
    ];
  }

  getCartItems(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartProducts = res.data;
        this.cartService.totalCartPrice.set(res.data.totalCartPrice);
        this.cartService.cartNumber.set(res.numOfCartItems);
        this.getSimilarProducts();
        this.isCartEmpty.set(true);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getSimilarProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.similarProducts = res.data;
        this.similarProducts = this.similarProducts
          .filter((product) => product)
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateProductCount(id: string, count: number): void {
    this.isLoading[id] = signal(true);
    this.cartService.updateCartQuantity(id, count).subscribe({
      next: (res) => {
        this.cartProducts = res.data;
        this.cartService.cartNumber.set(res.numOfCartItems);
        this.isLoading[id] = signal(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading[id] = signal(false);
      },
    });
  }

  removeSpecificCart(id: string): void {
    this.isLoadingRemove[id] = signal(true);

    this.cartService.removeSpecificCartItem(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success('Product removed successfully', 'Cart');
          console.log(res);
        }
        this.isLoading[id] = signal(false);
        this.isLoadingRemove[id] = signal(false);
        this.cartProducts = res.data;
        this.cartService.cartNumber.set(res.numOfCartItems);
      },
      error: (err) => {
        this.isLoadingRemove[id] = signal(false);
        console.log(err);
      },
    });
  }

  clearCartItem(): void {
    this.removeAllItemLoading.set(true);
    this.cartService.clearUserCart().subscribe({
      next: (res) => {
        if ((res.message = 'success')) {
          this.getCartItems();
          this.toastrService.success(
            'Your cart has been cleared successfully!',
            'Cart Cleared'
          );
          this.cartService.cartNumber.set(0);
        }
        this.removeAllItemLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.removeAllItemLoading.set(false);
      },
    });
  }

  addProductToCart(id: string): any {
    this.cartService.cartLoading[id] = true;
    this.cartService.AddToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.cartService.cartNumber.set(res.numOfCartItems);
          this.toastrService.success(res.message, 'Add To Cart');
          this.getCartItems();
          this.scrollToTop();
        }
        this.cartService.cartLoading[id] = false;
      },
      error: (err) => {
        console.log(err);
        this.cartService.cartLoading[id] = false;
      },
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  updateProductWishlist(id: string): void {
    this.wishlistService.updateWishlist(id);
  }

  preventPropagation(event: Event): void {
    event.stopPropagation();
  }

  calculateDeliveryDates() {
    const startDate = new Date(this.today);
    startDate.setDate(this.today.getDate() + 2);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2);
    this.estimatedEndDate.set(this.formatDate(endDate));
    console.log(this.estimatedEndDate());
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
