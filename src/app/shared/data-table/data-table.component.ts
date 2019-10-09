import { Component, EventEmitter, Input, OnChanges, ViewChild, Output } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})

export class DataTableComponent implements OnChanges {
  @Input()
  names;
  @Input()
  data;
  @Output()
  action = new EventEmitter();
  dataSource;
  displayedColumns;
  displayedColumnsNames;
  crudTable = true;

  @ViewChild(MatPaginator, {static:true})
  paginator: MatPaginator;
  @ViewChild(MatSort, {static:true})
  sort: MatSort;

  showPaginator: boolean;

  constructor() { }

  ngOnInit() {
    this.showPaginator = false;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnChanges() {
    this.displayedColumns = Object.keys(this.names);
    this.displayedColumnsNames = this.names;
    this.dataSource = new MatTableDataSource(this.data);
    this.tableTranslate();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  tableTranslate() {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
    this.paginator._intl.firstPageLabel = 'Primera página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
  }

  buttonClick(element: any) {
    this.action.emit(element);
  }

  getColor(value: string) {
    if (value.charAt(0) === '(') {
      return 'red';
    } else {
      return 'black';
    }
  }

  translateType() {
    return 'yes';
  }
}

