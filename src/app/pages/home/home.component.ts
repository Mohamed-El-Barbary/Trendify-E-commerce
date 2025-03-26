import { forkJoin } from 'rxjs';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { CategoryService } from '../../core/services/category/category.service';
import { ICategory } from '../../shared/interfaces/icategory';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ProductService } from '../../core/services/product/product.service';
import { IProuduct } from '../../shared/interfaces/iprouduct';
import { CartService } from '../../core/services/cart/cart.service';
import { RouterLink } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { NavColorService } from '../../core/services/navColor/nav-color.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IWishlist } from '../../shared/interfaces/iwishlist';

@Component({
  selector: 'app-home',
  imports: [
    MatTabsModule,
    CommonModule,
    CarouselModule,
    RouterLink,
    TabsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  readonly navColorService = inject(NavColorService);
  readonly wishlistService = inject(WishlistService);
  flashSale: IProuduct[] = [];
  categoryList: ICategory[] = [];
  allProducts: IProuduct[] = [];
  wishlistList: IWishlist[] = [];
  wishlistListProduct: IProuduct[] = [];
  titleCategory: string = '';
  @ViewChild('pannerSwiper') pannerEl!: ElementRef;
  @ViewChild('categorySwiper') categoryEl!: ElementRef;

  breakpoints = {
    320: { slidesPerView: 2, spaceBetween: 10 }, // Small screens
    480: { slidesPerView: 3, spaceBetween: 10 }, // Tablets
    630: { slidesPerView: 3, spaceBetween: 10 }, // Tablets
    768: { slidesPerView: 5, spaceBetween: 15 }, // Medium screens
    1024: { slidesPerView: 6, spaceBetween: 20 }, // Large screens
    1280: { slidesPerView: 8, spaceBetween: 30 }, // Extra large screens
  };

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
    this.getAllCategories();
    this.getUserProductWishlist();
  }

  categorySlider(direction: 'next' | 'prev') {
    if (this.categoryEl?.nativeElement?.swiper) {
      if (direction === 'next') {
        this.categoryEl.nativeElement.swiper.slideNext();
      } else {
        this.categoryEl.nativeElement.swiper.slidePrev();
      }
    }
  }

  pannerSlider(direction: 'next' | 'prev') {
    if (this.pannerEl?.nativeElement?.swiper) {
      if (direction === 'next') {
        this.pannerEl.nativeElement.swiper.slideNext();
      } else {
        this.pannerEl.nativeElement.swiper.slidePrev();
      }
    }
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryList = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  categoryTitle(title: string): void {
    this.titleCategory = title;
  }

  getFilteredProducts(): IProuduct[] {
    return this.allProducts.filter(
      (product) => product.category.name === this.titleCategory
    );
  }

  addProductToCart(id: any): any {
    if (typeof id === 'string') {
      return this.cartService.addProductToCart(id);
    } else if (typeof id === 'number') {
      id = id.toString();
      return this.cartService.addProductToCart(id);
    }
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

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  preventPropagation(event: Event): void {
    event.stopPropagation();
  }

  updateProductWishlist(id: string): void {
    this.wishlistService.updateWishlist(id);
  }

  getUserProductWishlist(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlistService.wishlist.set(
          res.data.map((item: any) => item._id)
        );
        this.getAllProduct();
      },
      error: (err) => console.log(err),
    });
  }

  getAllProduct(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.allProducts = res.data;
        this.wishlistListProduct = this.allProducts.filter((prod) =>
          this.wishlistService.wishlistListIds().includes(prod._id)
        );
      },
      error: (err) => console.log(err),
    });
  }
}
