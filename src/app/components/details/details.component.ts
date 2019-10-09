import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Order } from 'src/app/models/order';

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"]
})
export class DetailsComponent {

  private order:Order;
  private cedula:File;

  constructor(
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) DATA
  ) {
    console.log(DATA);
    this.order = DATA;
  }

  download() {
    const linkSource = this.order['copiaCedula'];
    const downloadLink = document.createElement("a");
    const fileName = `cedula_${this.order['nombre']}.pdf`;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  close() {
    this.dialogRef.close();
  }
}
