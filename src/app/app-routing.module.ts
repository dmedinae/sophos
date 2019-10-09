import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProductsComponent } from "./components/products/products.component";
import { CarComponent } from './components/car/car.component';
import { OrderComponent } from './components/order/order.component';
import { InformComponent } from './components/inform/inform.component';

const routes: Routes = [
  { path: "products", component: ProductsComponent },
  { path: "order", component: OrderComponent },
  { path: "car", component: CarComponent },
  { path: "inform", component: InformComponent },
  { path: "**", component: ProductsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
