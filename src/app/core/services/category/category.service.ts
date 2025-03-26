import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient:HttpClient) { }
  
  getAllCategories():Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories`)
  }


  getSpecificCategory(id:string):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories/${id}`)
  }

}
