import { NgClass } from '@angular/common';
import {
  Component,
  inject,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TabsModule } from 'primeng/tabs';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { AccordionModule } from 'primeng/accordion';
import { CategoryService } from '../../core/services/category/category.service';
import { ProductService } from '../../core/services/product/product.service';
import { IProuduct } from '../../shared/interfaces/iprouduct';
import { IShopify } from '../../shared/interfaces/ishopify';
import { forkJoin } from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';
import { CartService } from '../../core/services/cart/cart.service';
import { MenuModule } from 'primeng/menu';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-category',
  imports: [
    BreadcrumbModule,
    RouterLink,
    NgClass,
    TabsModule,
    DrawerModule,
    ButtonModule,
    Ripple,
    AvatarModule,
    AccordionModule,
    PaginatorModule,
    MenuModule,
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CategoryComponent {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);

  shopifyProduct: IShopify[] = [];
  productList: IProuduct[] = [];
  paginatedProducts: IProuduct[] = [];
  paginatedShopifyProducts: IShopify[] = [];
  titleCategory: WritableSignal<string> = signal('');
  categoryCount: WritableSignal<number> = signal(0);
  shopifyCount: WritableSignal<number> = signal(0);
  links: MenuItem[] | undefined;
  first: number = 0;
  rows: number = 12;
  totalRecords: WritableSignal<number> = signal(0);
  allTotalRecords: WritableSignal<number> = signal(0);
  totalRecordsShopify: WritableSignal<number> = signal(0);
  filterVisible: WritableSignal<boolean> = signal(false);
  items: MenuItem[] | undefined;
  productListLength: WritableSignal<number> = signal(0);
  allproducts: IProuduct[] = [];

  sayHallo(): void {
    console.log('hello');
  }

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData(): void {
    this.links = [{ label: 'Home', route: '/home' }, { label: 'Category' }];
    this.items = [
      {
        label: 'Sort By Price',
        items: [
          {
            label: 'High To Low',
            icon: 'pi pi-sort-amount-down',
            command: () => this.sortProductsByPrice('low'),
          },
          {
            label: 'Low To High',
            icon: 'pi pi-sort-amount-up',
            command: () => this.sortProductsByPrice('high'),
          },
        ],
      },
    ];
    this.getAllProducts();
    this.getAllCategories();
    this.categoryTitle('All');
    this.getShopifyProduct();
  }

  getAllProducts(): void {
    const getAllProducts$ = this.productService.getAllProducts();
    const getLimitProducts$ = this.productService.getLimitProduct();

    forkJoin([getAllProducts$, getLimitProducts$]).subscribe({
      next: ([allProductsResponse, limitProductsResponse]) => {
        const allProducts = allProductsResponse.data;
        const limitProducts = limitProductsResponse.data;
        this.productList = [...allProducts, ...limitProducts];
        this.updatePaginatedAllProducts();
        this.updateCategoryCount();
        this.updatePaginatedProducts();
        this.getProductListLengh();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  getProductListLengh(): void {
    this.productListLength.set(this.productList.length);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedProducts();
    this.updatePaginatedShopifyProducts();
    this.updatePaginatedAllProducts();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  categoryTitle(title: string): void {
    this.titleCategory.set(title);
    this.first = 0;
    this.updatePaginatedProducts();
    this.updateCategoryCount();
    this.shopifyCountProductOfCategory();
    this.updatePaginatedShopifyProducts();
  }

  sortProductsByPrice(price: 'high' | 'low'): void {
    const sortItemProduct = (a: IProuduct, b: IProuduct) =>
      price === 'low' ? a.price - b.price : b.price - a.price;

    const sortItemShopifyProduct = (a: IShopify, b: IShopify) => {
      const priceA = parseFloat(a.variants[0].price);
      const priceB = parseFloat(b.variants[0].price);
      return price === 'low' ? priceA - priceB : priceB - priceA;
    };

    this.productList.sort(sortItemProduct);
    this.allproducts.sort(sortItemProduct);
    this.shopifyProduct.sort(sortItemShopifyProduct);
    this.updatePaginatedAllProducts();
    this.updatePaginatedProducts();
    this.updatePaginatedShopifyProducts();
  }

  getFilteredProducts(): IProuduct[] {
    return this.productList.filter(
      (product) => product.category.name === this.titleCategory()
    );
  }

  updateCategoryCount(): void {
    const filteredProducts = this.getFilteredProducts();
    this.categoryCount.set(filteredProducts.length);
    this.totalRecords.update(() => filteredProducts.length);
  }

  updatePaginatedAllProducts(): void {
    if (!this.productList || this.productList.length === 0) {
      return;
    }

    const allFilterProduct = this.productList;
    const start = this.first;
    const end = Math.min(start + this.rows, allFilterProduct.length);
    this.allproducts = allFilterProduct.slice(start, end);
    this.allTotalRecords.update(() => allFilterProduct.length);
  }

  updatePaginatedProducts(): void {
    if (!this.productList || this.productList.length === 0) {
      return;
    }

    const filteredProducts = this.getFilteredProducts();
    const start = this.first;
    const end = Math.min(start + this.rows, filteredProducts.length);
    this.paginatedProducts = filteredProducts.slice(start, end);
  }

  getShopifyProduct(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        console.log(res);
        this.shopifyProduct = res.products;
        this.updatePaginatedShopifyProducts();
      },
      error: (err) => {
        console.error('Error fetching Shopify products:', err);
      },
    });
  }

  getShopifyFilterProduct(): IShopify[] {
    return this.shopifyProduct.filter(
      (product) => product.product_type === this.titleCategory()
    );
  }

  updatePaginatedShopifyProducts(): void {
    if (!this.shopifyProduct || this.shopifyProduct.length === 0) {
      return;
    }
    const filteredShopifyProducts = this.getShopifyFilterProduct();
    const start = this.first;
    const end = Math.min(start + this.rows, filteredShopifyProducts.length);
    this.paginatedShopifyProducts = filteredShopifyProducts.slice(start, end);
  }

  shopifyCountProductOfCategory(): void {
    const filteredShopifyProducts = this.getShopifyFilterProduct();
    this.shopifyCount.set(filteredShopifyProducts.length);
    this.totalRecordsShopify.set(filteredShopifyProducts.length);
  }

  getDiscountedPrice(price: any): number {
    let numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return Math.floor(numericPrice * 0.8);
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

  updateProductWishlist(id: string): void {
    this.wishlistService.updateWishlist(id);
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  preventPropagation(event: Event): void {
    event.stopPropagation();
  }
}
