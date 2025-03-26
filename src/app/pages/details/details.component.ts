import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ProductService } from '../../core/services/product/product.service';
import { IProuduct } from '../../shared/interfaces/iprouduct';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { AccordionModule } from 'primeng/accordion';
import { HttpErrorResponse } from '@angular/common/http';
import { IShopify } from '../../shared/interfaces/ishopify';
import { GalleriaModule } from 'primeng/galleria';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-details',
  imports: [
    CommonModule,
    RouterLink,
    CurrencyPipe,
    AccordionModule,
    GalleriaModule,
    BreadcrumbModule,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetailsComponent {
  private readonly productService = inject(ProductService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);
  @ViewChild('swiperContainer') swiperEl!: ElementRef;

  productList: IProuduct[] = [];
  shopifyProduct: IShopify[] = [];
  productShopifyCategory: IShopify[] = [];
  filterProductByCategory: IProuduct[] = [];
  productDetails: IProuduct | null = null;
  productShopifyDetails: IShopify | null = null;
  selectedColor: WritableSignal<string> = signal('Blue');
  selectedSize: WritableSignal<string> = signal('Medium');
  estimatedEndDate: WritableSignal<string> = signal('');
  estimatedStartDate: WritableSignal<string> = signal('');
  cratLoading: WritableSignal<boolean> = signal(false);
  countcart: number = 1;
  hasHalfStar: WritableSignal<boolean> = signal(false);
  today: Date = new Date();
  productPrice!: number;
  productShopifyPrice!: number;
  productRating: number = 0;
  fullStars: number = 0;
  emptyStars: number = 0;
  links: MenuItem[] | undefined;

  productsColors = [
    { name: 'Blue', hex: '#4A80E2' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Brown', hex: '#C88242' },
    { name: 'Black', hex: '#212F39' },
    { name: 'Dusty Rose', hex: '#DCB9A8' },
    { name: 'Sage Green', hex: '#A7B2A3' },
  ];

  productsSize = [
    { value: 'Extra Small', size: 'XS' },
    { value: 'Small', size: 'S' },
    { value: 'Medium', size: 'M' },
    { value: 'Large', size: 'L' },
    { value: 'Extra Large', size: 'XL' },
    { value: 'Double Extra Large', size: 'XXL' },
    { value: 'Triple Extra Large', size: 'XXXL' },
  ];

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData(): void {
    this.calculateDeliveryDates();
    this.calculateStars();
    this.getAllProductDetails();
    console.log('Product Shopify Category:', this.productShopifyCategory);
  }

  updateBreadcrumb() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      const containsLetters = /[a-zA-Z]/.test(id!);
      if (containsLetters) {
        const selectedProduct = this.productList.find((p) => p.id === id);

        this.links = [
          { label: 'Home', route: '/home' },
          { label: 'Category', route: '/products' },
          {
            label: selectedProduct
              ? selectedProduct.category.name
              : 'Product Not Found',
          },
          {
            label: selectedProduct
              ? selectedProduct.title.split(' ').slice(0, 3).join(' ')
              : 'Product Not Found',
          },
        ];
      } else if (!isNaN(Number(id))) {
        const numid = Number(id); // تحويل id إلى رقم
        const selectedProduct = this.shopifyProduct.find((p) => p.id === numid);
        this.links = [
          { label: 'Home', route: '/home' },
          { label: 'Category', route: '/products' },
          {
            label: selectedProduct
              ? selectedProduct.product_type
              : 'Product Not Found',
          },
          {
            label: selectedProduct
              ? selectedProduct.title.split(' ').slice(0, 3).join(' ')
              : 'Product Not Found',
          },
        ];
      }
    });
  }

  getAllProduct(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        console.log(res);
        this.productList = res.data;
        if (this.productDetails?.category.name) {
          this.filterProductByCategory = this.productList
            .filter(
              (product) =>
                product.category?.name === this.productDetails?.category.name &&
                product._id !== this.productDetails._id
            )
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
        }
        this.updateBreadcrumb();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getShopifyProduct(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        console.log(res);
        this.shopifyProduct = res.products;
        this.productShopifyCategory = this.shopifyProduct
          .filter(
            (product) =>
              product.product_type ===
                this.productShopifyDetails?.product_type &&
              product.id !== this.productShopifyDetails?.id
          )
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
        console.log('Filtered Products:', this.productShopifyCategory);
        this.updateBreadcrumb();
      },
      error: (err) => {
        console.error('Error fetching Shopify products:', err);
      },
    });
  }

  getAllProductDetails(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        let id = params.get('id');
        const containsLetters = /[a-zA-Z]/.test(id!);

        if (containsLetters) {
          this.productService.getSpecificProducts(id!).subscribe({
            next: (res) => {
              this.productDetails = res.data;
              this.productPrice = res.data.price;
              this.productRating = res.data.ratingsAverage;
              this.getPriceOfProduct();
              this.calculateStars();
              this.getAllProduct();
            },
            error: (err: HttpErrorResponse) => {
              console.log('Error In Product Details', err);
            },
          });
        } else if (!isNaN(Number(id))) {
          console.log('Error in Product Shopify Details.');
          this.productService.getSpecificShopifyProduct(id!).subscribe({
            next: (res) => {
              this.productShopifyDetails = res.product;
              this.productShopifyPrice = res.product.variants[0].price;
              this.productShopifyCategory = res.product.product_type;
              this.getShopifyProduct();
            },
            error: (err) => {
              console.log(' API Error in Shpoify Api :', err);
            },
          });
        } else {
          console.log("ID Does'nt Exist On Api");
        }
      },
    });
  }

  addProductToCart(id: string): any {
    return this.cartService.addProductToCart(id);
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

  setSelectedColor(color: string) {
    this.selectedColor.set(color);
  }

  setSelectedSize(size: string) {
    this.selectedSize.set(size);
  }

  increaseQuantity() {
    if (this.productPrice !== undefined) {
      if (this.countcart < this.productDetails!.quantity) {
        this.countcart++;
        this.getPriceOfProduct();
      }
    } else if (this.productShopifyPrice !== undefined) {
      if (
        this.countcart <
        this.productShopifyDetails!.variants[0].inventory_quantity
      ) {
        this.countcart++;
        this.getPriceOfProduct();
      }
    }
  }

  decreaseQuantity() {
    if (this.countcart > 1) {
      this.countcart--;
      this.getPriceOfProduct();
    }
  }

  getPriceOfProduct(): any {
    if (this.productPrice !== undefined) {
      return this.productPrice * this.countcart;
    } else if (this.productShopifyPrice !== undefined) {
      return this.productShopifyPrice * this.countcart;
    }
  }

  calculateDeliveryDates() {
    const startDate = new Date(this.today);
    startDate.setDate(this.today.getDate() + 2);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2);
    this.estimatedStartDate.set(this.formatDate(startDate));
    this.estimatedEndDate.set(this.formatDate(endDate));
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  calculateStars() {
    this.fullStars = Math.floor(this.productRating);
    const decimalPart = this.productRating - this.fullStars;
    this.hasHalfStar.set(decimalPart > 0);
    this.emptyStars = 5 - this.fullStars - (this.hasHalfStar() ? 1 : 0);
  }

  get fullStarsArray() {
    return new Array(Math.max(0, this.fullStars)).fill(0);
  }

  get emptyStarsArray() {
    return new Array(Math.max(0, this.emptyStars)).fill(0);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  preventPropagation(event: Event): void {
    event.stopPropagation();
  }

  categorySlider(direction: 'next' | 'prev') {
    if (this.swiperEl?.nativeElement?.swiper) {
      if (direction === 'next') {
        this.swiperEl.nativeElement.swiper.slideNext();
      } else {
        this.swiperEl.nativeElement.swiper.slidePrev();
      }
    }
  }
}
