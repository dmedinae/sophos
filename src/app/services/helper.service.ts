import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Product } from '../models/products';

@Injectable({
  providedIn: "root"
})
export class HelperService {
  private order = new BehaviorSubject<Array<Product>>([]);
  public customOrder = this.order.asObservable();

  constructor() {}

  public changeOrder(order: Array<Product>): void {
    this.order.next(order);
  }
}
