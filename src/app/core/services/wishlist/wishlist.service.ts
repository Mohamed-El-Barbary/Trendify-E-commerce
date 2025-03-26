import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly toastrService: ToastrService
  ) {}

  myToken: string = localStorage.getItem('userToken')!;
  wishListNumber: WritableSignal<number> = signal(0);
  wishlistListIds = computed(() => this.wishlist());
  wishlist: WritableSignal<string[]> = signal([]);

  addToWishlist(id: string): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/wishlist`,
      {
        productId: id,
      }
    );
  }

  removeProductFromWishlist(id: string): Observable<any> {
    return this.httpClient.delete(
      `${environment.baseUrl}/api/v1/wishlist/${id}`
    );
  }

  getLoggedUserWishlist(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/wishlist`);
  }

  updateWishlist(id: string): void {
    const isInWishlist = this.wishlist().includes(id);
    if (!isInWishlist) {
      this.addToWishlist(id).subscribe({
        next: (res) => {
          console.log(res);
          this.wishlist.update((list) => [...list, id]);
          this.toastrService.success(
            'Product added to wishlist successfully',
            'Wishlist'
          );
          this.wishListNumber.set(res.data.length);
          console.log(this.wishListNumber());
        },
        error: (err) => {
          console.error('Error adding to wishlist:', err);
        },
      });
    } else {
      this.removeProductFromWishlist(id).subscribe({
        next: (res) => {
          console.log(res);
          this.wishlist.update((list) =>
            list.filter((prodId) => prodId !== id)
          );
          this.toastrService.success(
            'Product removed from wishlist successfully',
            'Wishlist'
          );
          this.wishListNumber.set(res.data.length);
          console.log(this.wishListNumber());
        },
        error: (err) => {
          console.error('Error removing from wishlist:', err);
        },
      });
    }
  }
}
