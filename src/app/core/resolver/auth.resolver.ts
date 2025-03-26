import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';

export const authResolver: ResolveFn<boolean> = async (route, state) => {

 const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  if (isPlatformBrowser(platformId)) {
    const tokenExists = localStorage.getItem('userToken') !== null;

    if (tokenExists) {
      await router.navigate(['/home']); // توجيه المستخدم إلى الصفحة الرئيسية
    } else {
      await router.navigate(['/landing']); // توجيه المستخدم إلى صفحة الهبوط
    }
  }

  return true;
};
