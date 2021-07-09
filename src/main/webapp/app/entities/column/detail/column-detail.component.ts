import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IColumn } from '../column.model';

@Component({
  selector: 'jhi-column-detail',
  templateUrl: './column-detail.component.html',
})
export class ColumnDetailComponent implements OnInit {
  column: IColumn | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ column }) => {
      this.column = column;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
