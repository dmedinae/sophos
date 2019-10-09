import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends BaseService{

  constructor(private _http: HttpClient, private Cs: CookieService) { 
    super(_http, Cs);
  }

  public getProducts() {
    return this.get("productos", this.setOptions(0, false, false));
  }    
}
