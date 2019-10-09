import { Component, OnInit } from "@angular/core";
import { ProductsService } from "src/app/services/products.service";
import { Order } from "src/app/models/order";
import { BaseComponent } from "src/app/shared/base/base.component";
import { MatDialog, MatSnackBar } from "@angular/material";
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"]
})
export class OrderComponent extends BaseComponent implements OnInit {
  showTable = false;
  pedidos;

  namesTable = {
    idPedido: "ID",
    nombre: "Nombre",
    fechaNacimiento: "Fecha nacimiento",
    direccionEnvio: "Dirección envío",
    ciudad: "Ciudad",
    detail: "Detalle"
  };

  constructor(
    private dialogs: MatDialog,
    private snackBars: MatSnackBar,
    private productService: ProductsService
  ) {
    super(dialogs, snackBars, null);
  }

  ngOnInit() {
    this.pedidos = this.productService.readLocalStorage("pedidos");
    console.log(this.pedidos);
    if (this.pedidos) {
      this.showTable = true;
    }
  }

  action(order: Order) {
    console.log(order);
    this.openDialog(DetailsComponent, order, "dialog-form");
  }
}
