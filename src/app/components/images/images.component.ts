import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-images",
  templateUrl: "./images.component.html",
  styleUrls: ["./images.component.scss"]
})
export class ImagesComponent {
  url = "";
  title = "";

  constructor(
    private dialogRef: MatDialogRef<ImagesComponent>,
    @Inject(MAT_DIALOG_DATA) DATA
  ) {
    this.url = DATA["imagen"];
    this.title = DATA["descripcion"];
  }

  close() {
    this.dialogRef.close();
  }
}
