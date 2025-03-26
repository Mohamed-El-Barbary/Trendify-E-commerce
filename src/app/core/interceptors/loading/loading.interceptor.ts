import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const ngxSpinnerService = inject(NgxSpinnerService);
  let isLoading = false;

  if (req.method === 'GET') {
    ngxSpinnerService.show();
    isLoading = true;
  }

  return next(req).pipe(
    finalize(() => {
      if (isLoading) {
        ngxSpinnerService.hide();
      }
    })
  );
};
