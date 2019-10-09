import { Component, OnChanges, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-template',
  templateUrl: './dialog-template.component.html',
  styleUrls: ['./dialog-template.component.scss']
})
export class DialogTemplateComponent implements OnChanges {
  data;
  dataReturn = {};

  constructor(private dialogRef: MatDialogRef<DialogTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) DATA) { 
      this.data = DATA['data'];
      this.dataReturn['action'] = DATA['action'];
    }

  ngOnChanges() {
    
  }

  save(){
    this.dialogRef.close(this.dataReturn);
  }

  close() {
    this.dialogRef.close();
  }

}
