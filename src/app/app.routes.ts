import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { LandingLayoutComponent } from './layouts/landing-layout/landing-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { logedGuard } from './core/guards/loged.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [logedGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.component').then((m) => m.LoginComponent),
        title: 'loginPage',
      },
      {
        path: 'signin',
        loadComponent: () =>
          import('./pages/sign-up/sign-up.component').then(
            (m) => m.SignUpComponent
          ),
        title: 'signPage',
      },
      {
        path: 'resetpassword',
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
        title: 'resetPasswordPage',
      },
    ],
  },

  {
    path: '',
    component: LandingLayoutComponent,
    canActivate: [logedGuard],
    children: [
      {
        path: 'landing',
        loadComponent: () =>
          import('./pages/landingpage/landingpage.component').then(
            (m) => m.LandingpageComponent
          ),
        title: 'LandingPage',
      },
    ],
  },

  {
    path: '',
    component: BlankLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
        title: 'HomePage',
      },
      {
        path: 'products',
        title: 'produtcs',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/category/category.component').then(
                (m) => m.CategoryComponent
              ),
          },
          {
            path: 'details/:id',
            loadComponent: () =>
              import('./pages/details/details.component').then(
                (m) => m.DetailsComponent
              ),
            title: 'detailsPage',
          },
          {
            path: 'cart',
            loadComponent: () =>
              import('./pages/cart/cart.component').then(
                (m) => m.CartComponent
              ),
            title: 'cartPage',
          },
          {
            path: 'checkout/:id',
            loadComponent: () =>
              import('./pages/checkout/checkout.component').then(
                (m) => m.CheckoutComponent
              ),
            title: 'checkoutPage',
          },
        ],
      },
      {
        path: 'allorders',
        loadComponent: () =>
          import('./pages/allorders/allorders.component').then(
            (m) => m.AllordersComponent
          ),
        title: 'cartPage',
      },
      {
        path: 'about-us',
        loadComponent: () =>
          import('./pages/about-us/about-us.component').then(
            (m) => m.AboutUsComponent
          ),
        title: 'aboutUsPage',
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./pages/blog/blog.component').then((m) => m.BlogComponent),
        title: 'blogPage',
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./pages/wishlist/wishlist.component').then((m) => m.WishlistComponent),
        title: 'wishlistPage',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
        title: 'profilePage',
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
        title: 'contactPage',
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/not-found/not-found.component').then(
            (m) => m.NotFoundComponent
          ),
        title: 'Page Not Found',
      },
    ],
  },
];
