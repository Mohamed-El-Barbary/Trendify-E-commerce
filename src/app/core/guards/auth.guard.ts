import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  let id = inject(PLATFORM_ID);

  if (isPlatformBrowser(id)) {
    if (localStorage.getItem('userToken') !== null) {
      return true;
    } else {
      router.navigate(['/landing']);
      return false;
    }
  } else {
    return false;
  }
};
