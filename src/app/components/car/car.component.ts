import { Component, OnInit } from "@angular/core";
import { HelperService } from "src/app/services/helper.service";
import { Product } from "src/app/models/products";
import { BaseComponent } from "src/app/shared/base/base.component";
import { MatDialog, MatSnackBar } from "@angular/material";
import { FormComponent } from '../form/form.component';

@Component({
  selector: "app-car",
  templateUrl: "./car.component.html",
  styleUrls: ["./car.component.scss"]
})
export class CarComponent extends BaseComponent implements OnInit {
  private order: Array<Product> = [];

  constructor(
    private dialogs: MatDialog,
    private snackBars: MatSnackBar,
    private helperService: HelperService
  ) {
    super(dialogs, snackBars, null);
  }

  ngOnInit() {
    this.helperService.customOrder.subscribe(data => {
      this.order = data;
      console.log(data);
    });
  }

  afterCloseDialog(data) { 
    if(data) {
      this.helperService.changeOrder([]);
      this.closeDialog();
      this.openSnackBar("Pedido radicado con exito");
    }
  }

  makeOrder() {
    this.openDialog(FormComponent, this.order, "dialog-form");
  }
}
