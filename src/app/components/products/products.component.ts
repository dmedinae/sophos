import { Component, OnInit } from "@angular/core";
import { ProductsService } from "src/app/services/products.service";
import { BaseComponent } from "src/app/shared/base/base.component";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ImagesComponent } from "../images/images.component";
import { Product } from "src/app/models/products";
import { HelperService } from "src/app/services/helper.service";
import { LoadingComponent } from "src/app/shared/loading/loading.component";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"]
})
export class ProductsComponent extends BaseComponent implements OnInit {
  private products: Array<Product> = [];
  private order: Array<Product> = [];

  constructor(
    private productService: ProductsService,
    private dialogs: MatDialog,
    private snackBars: MatSnackBar,
    private helperService: HelperService
  ) {
    super(dialogs, snackBars, null);
  }

  ngOnInit() {
    if (!this.productService.readLocalStorage("pedidos")) {
      this.productService.setLocalStorage("pedidos", []);
    }
    this.openDialog(LoadingComponent, this.loadingMessage, "dialog-loading");
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.products.forEach(product => {
        product.cantidadSolicitada = 0;
      });
      this.closeDialog();
      console.log(data);
    });
    this.helperService.customOrder.subscribe(data => {
      this.order = data;
      console.log(data);
    });
  }

  openImage(product) {
    this.openDialog(ImagesComponent, product, "dialog-image");
  }

  add(product: Product) {
    if (product.cantidadDisponible > 0) {
      let result: Array<Product> = this.order.filter(row => row.idProducto == product.idProducto);
      if (result.length > 0) {
        this.openSnackBar("Este producto ya fue agregado!!!");
      } else {
        this.order.push(product);
        this.helperService.changeOrder(this.order);
        this.openSnackBar("Producto agregado!!!!!!");
      }
    } else {
      this.openSnackBar("Este producto no está disponible!!!");
    }
  }

  checkQuantity(selectedQuantity: string, product: Product) {
    setTimeout(() => {
      if (parseInt(selectedQuantity) > product.cantidadDisponible) {
        product.cantidadSolicitada = product.cantidadDisponible;
      } else {
        product.cantidadSolicitada = parseInt(selectedQuantity);
      }
      console.log(
        selectedQuantity,
        product.cantidadSolicitada,
        product.cantidadDisponible
      );
    }, 5);
  }
}
