import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  message: string;

  constructor(
    private dialogRef: MatDialogRef<LoadingComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.message = data;
  }

  ngOnInit() {}
}
