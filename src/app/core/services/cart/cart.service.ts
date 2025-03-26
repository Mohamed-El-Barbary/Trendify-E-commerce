import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private httpClient: HttpClient,
    private toastrService: ToastrService
  ) {}

  totalCartPrice: WritableSignal<number> = signal(0);
  myToken: string = localStorage.getItem('userToken')!;
  cartLoading: Record<string, boolean> = {};
  cartMainItemLoading: boolean = false;
  succsesMsg: WritableSignal<string> = signal('');
  cartNumber: WritableSignal<number> = signal(0);

  AddToCart(id: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/cart`, {
      productId: id,
    });
  }

  updateCartQuantity(id: string, countNum: number): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/cart/${id}`, {
      count: countNum,
    });
  }

  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/cart`, {
      headers: {
        token: this.myToken,
      },
    });
  }

  removeSpecificCartItem(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart/${id}`);
  }

  clearUserCart(): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart`);
  }

  // Add To Cart Functionality

  addProductToCart(id: string): void {
    this.cartMainItemLoading = true;
    this.cartLoading[id] = true;
    this.AddToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.succsesMsg.set(res.status);
          this.toastrService.success(res.message, 'Add To Cart');
        }
        this.cartLoading[id] = false;
        this.cartMainItemLoading = false;
        this.cartNumber.set(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
        console.log(this.myToken);
        this.cartLoading[id] = false;
        this.cartMainItemLoading = false;
      },
    });
  }
}
