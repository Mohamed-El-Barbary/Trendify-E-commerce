import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  QueryList,
  Signal,
  signal,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { NavColorService } from '../../core/services/navColor/nav-color.service';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    DialogModule,
    AccordionModule,
    ReactiveFormsModule,
    MenuModule,
    ButtonModule,
    BadgeModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly navColorService = inject(NavColorService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);
  @ViewChildren('navLink', { read: ElementRef }) linkEl!: QueryList<ElementRef>;
  isLoading: WritableSignal<boolean> = signal(false);
  isLogin = input<boolean>(true);
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  isCurrentPasswordVisible: boolean = false;
  showPasswordToggle: boolean = false;
  showConfirmPasswordToggle: boolean = false;
  showCurrentPasswordToggle: boolean = false;
  msgErr: WritableSignal<string> = signal('');
  successeded: WritableSignal<string> = signal('');
  visible: boolean = false;
  items: MenuItem[] | undefined;
  navlinks: WritableSignal<boolean> = signal(false);
  isScrolled: WritableSignal<boolean> = signal(false);
  countCartNumber: Signal<number> = computed(() =>
    this.cartService.cartNumber()
  );
  countWishlistNumber: Signal<number> = computed(() =>
    this.wishlistService.wishListNumber()
  );

  ngOnInit() {
    this.initializeData();
  }

  initializeData(): void {
    this.items = [
      {
        label: 'Profile',
        items: [
          {
            label: 'Update User Info',
            icon: 'pi pi-cog',
            shortcut: '⌘+O',
            command: () => this.showDialog(),
          },
          {
            label: 'Orders',
            icon: 'pi pi-inbox',
            routerLink: ['allorders'],
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            shortcut: '⌘+Q',
            command: () => this.authService.logOut(),
          },
        ],
      },
    ];
    this.router.events.subscribe(() => {
      this.changeHomeColor(this.router.url);
      console.log(this.router.url);
    });

    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartService.cartNumber.set(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.wishlistService.getLoggedUserWishlist().subscribe({
      next:(res)=>{
        console.log(res)
        this.wishlistService.wishListNumber.set(res.count)
      },error:(err)=>{
        console.log(err)
      }
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.changeHomeColor(this.router.url);
    });
  }

  updateUserDataForm: FormGroup = this.formBuilder.group({
    name: [
      null,
      [Validators.required, Validators.minLength(3), Validators.maxLength(25)],
    ],
    email: [null, [Validators.required, Validators.email]],
    phone: [
      null,
      [Validators.required, Validators.pattern(/^01(0|1|2|5)\d{8}$/)],
    ],
  });

  updatePasswordForm: FormGroup = this.formBuilder.group(
    {
      currentPassword: [
        null,
        [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{7,}$/)],
      ],
      password: [
        null,
        [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{7,}$/)],
      ],
      rePassword: [null, [Validators.required]],
    },
    { validators: [this.confirmPassword] }
  );

  submitUpdatePasswordForm(): void {
    this.isLoading.set(true);
    this.authService
      .updateLoggedUserPassword(this.updatePasswordForm.value)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading.set(false);
          this.msgErr.set('');
          this.successeded.set(res.message);
          setTimeout(() => {
            this.successeded.set('');
          }, 5000);
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.error.errors.msg) {
            this.msgErr.set(err.error.errors.msg);
          } else {
            this.msgErr.set(err.error.message);
          }
          setTimeout(() => {
            this.msgErr.set('');
          }, 5000);
          console.log(err);
        },
      });
  }

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    return password === rePassword ? null : { mismatch: true };
  }

  showDialog() {
    this.visible = true;
    console.log('Hallo');
  }

  homeRoute(): string {
    return localStorage.getItem('userToken') ? '/home' : '/landing';
  }

  toggleVisibility(field: 'password' | 'confirmPassword' | 'currentPassword') {
    if (field === 'password') {
      this.isPasswordVisible = !this.isPasswordVisible;
    } else if (field === 'confirmPassword') {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    } else {
      this.isCurrentPasswordVisible = !this.isCurrentPasswordVisible;
    }
  }

  onInput(
    event: Event,
    field: 'password' | 'confirmPassword' | 'currentPassword'
  ) {
    const input = event.target as HTMLInputElement;
    if (field === 'password') {
      this.showPasswordToggle = input.value.length > 0;
    } else if (field === 'confirmPassword') {
      this.showConfirmPasswordToggle = input.value.length > 0;
    } else {
      this.showCurrentPasswordToggle = input.value.length > 0;
    }
  }

  showNavLinks() {
    this.navlinks.update((value) => !value);
    console.log(this.navlinks());
  }

  changeHomeColor(currentPath: string): void {
    if (!this.linkEl || this.linkEl.length === 0) return;

    this.linkEl.forEach((link) => {
      if (currentPath === '/home') {
        link.nativeElement.style.color = 'white';
      } else {
        link.nativeElement.style.color = '';
      }
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleLinkClick(): void {
    this.showNavLinks();
    this.scrollToTop();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 80);
    this.updateNavColor();
  }

  updateNavColor(): void {
    this.linkEl.forEach((link) => {
      if (this.router.url === '/home') {
        if (this.isScrolled()) {
          link.nativeElement.style.color = '#9D9DAA';
        } else {
          link.nativeElement.style.color = 'white';
        }
      }
    });
  }
}
