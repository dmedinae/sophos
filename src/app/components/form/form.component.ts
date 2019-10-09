import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatSnackBar
} from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BaseComponent } from "src/app/shared/base/base.component";
import { ProductsService } from "src/app/services/products.service";
import { Order } from "src/app/models/order";
import { HelperService } from "src/app/services/helper.service";
import { LoadingComponent } from "src/app/shared/loading/loading.component";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"]
})
export class FormComponent extends BaseComponent implements OnInit {
  private orderForm: FormGroup;
  private maxDate = new Date();
  private filesMessage = "";
  private file;
  AllowedExt = ["pdf"];
  private products;
  private cities = [
    { municipio: "Medellín" },
    {
      municipio: "Abejorral"
    },
    {
      municipio: "Abriaquí"
    },
    {
      municipio: "Alejandría"
    },
    {
      municipio: "Amagá"
    },
    {
      municipio: "Amalfi"
    },
    {
      municipio: "Andes"
    },
    {
      municipio: "Angelópolis"
    },
    {
      municipio: "Angostura"
    },
    {
      municipio: "Anorí"
    },
    {
      municipio: "Chimá"
    },
    {
      municipio: "Anza"
    },
    {
      municipio: "Apartadó"
    },
    {
      municipio: "Arboletes"
    },
    {
      municipio: "Argelia"
    },
    {
      municipio: "Armenia"
    },
    {
      municipio: "Barbosa"
    },
    {
      municipio: "Bello"
    },
    {
      municipio: "Betania"
    },
    {
      municipio: "Betulia"
    },
    {
      municipio: "Ciudad Bolívar"
    }
  ];

  constructor(
    private dialogs: MatDialog,
    private snackBars: MatSnackBar,
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<FormComponent>,
    private productService: ProductsService,
    private helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) DATA
  ) {
    super(dialogs, snackBars, null);
    console.log(DATA);
    this.products = DATA;
  }

  ngOnInit() {
    this.orderForm = this._formBuilder.group({
      nombre: ["", Validators.required],
      fechaNacimiento: ["", Validators.required],
      direccionEnvio: ["", Validators.required],
      ciudad: ["", Validators.required],
      copiaCedula: ["", Validators.required]
    });
  }

  onFileInput(event) {
    // console.log(campo, event);
    let fileName = event.target.files[0]["name"].split(".");
    if (fileName.length > 2) {
      alert("El nombre del archivo no puede contener puntos(.)");
      return false;
    }

    let ext = fileName[1].toLowerCase();

    if (!this.AllowedExt.includes(ext)) {
      alert(`El archivo debe ser ${this.AllowedExt}`);
      return false;
    }

    if (event.target.files[0]["size"] > 1000000) {
      alert(`El tamaño del archivo debe ser inferior a 2MB`);
      return false;
    }

    //this.orderForm.value['copiaCedula'] = event.target.files[0];
    this.file = event.target.files[0];

    var myReader: FileReader = new FileReader();

    myReader.onloadend = e => {
      this.orderForm.get("copiaCedula").setValue(myReader.result);
    };
    myReader.readAsDataURL(this.file);

    this.filesMessage = event.target.files[0]["name"];
    console.log(this.orderForm.value);

    console.log(this.orderForm);
  }

  save() {
    this.openDialog(LoadingComponent, this.loadingMessage, "dialog-loading");
    setTimeout(() => {
      let pedidos: Array<Order> = this.productService.readLocalStorage(
        "pedidos"
      );
      console.log(pedidos);
      let id = Math.floor(Math.random() * 999999);
      this.orderForm.value["idPedido"] = id;
      this.orderForm.value["productos"] = this.products;
      let order: Order = this.orderForm.value;
      pedidos.push(order);
      console.log(id);
      this.productService.setLocalStorage("pedidos", pedidos);
      this.dialogRef.close(true);
    }, 1000);
  }

  close() {
    this.dialogRef.close();
  }
}
