import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  
  if (localStorage.getItem('userToken')) {
    req = req.clone({
      setHeaders: {
        token: localStorage.getItem('userToken')!,
      },
    });
  }

  return next(req);
};
