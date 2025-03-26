import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router) {}
  userData: any;

  myToken: string = localStorage.getItem('userToken')!;

  signUp(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signup`,
      data
    );
  }

  login(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signin`,
      data
    );
  }

  getUsersData(): any {
    this.userData = jwtDecode(localStorage.getItem('userToken')!);
    return this.userData;
  }

  logOut(): void {
    localStorage.removeItem('userToken');
    this.userData = null;
    this.router.navigate(['/landing']);
  }

  verifyEmail(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/forgotPasswords`,
      data
    );
  }
  verifyCode(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/verifyResetCode`,
      data
    );
  }
  resetPassword(data: object): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/auth/resetPassword`,
      data
    );
  }

  updateLoggedUserPassword(data: object): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/users/changeMyPassword`,
      data
    );
  }

  updateLoggedUserData(data: object): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/users/updateMe/`,
      data
    );
  }
}
