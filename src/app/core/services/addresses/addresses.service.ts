import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  constructor(private readonly httpClient: HttpClient) {}

  addAddress(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/addresses`,
      data
    );
  }

  getLoggedUserAddresses(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/addresses`);
  }

  removeAddress(id: string): Observable<any> {
    return this.httpClient.delete(
      `${environment.baseUrl}/api/v1/addresses/${id}`
    );
  }
}
