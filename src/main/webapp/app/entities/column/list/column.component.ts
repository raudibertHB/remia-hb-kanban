import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IColumn } from '../column.model';
import { ColumnService } from '../service/column.service';
import { ColumnDeleteDialogComponent } from '../delete/column-delete-dialog.component';

@Component({
  selector: 'jhi-column',
  templateUrl: './column.component.html',
})
export class ColumnComponent implements OnInit {
  columns?: IColumn[];
  isLoading = false;

  constructor(protected columnService: ColumnService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.columnService.query().subscribe(
      (res: HttpResponse<IColumn[]>) => {
        this.isLoading = false;
        this.columns = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IColumn): number {
    return item.id!;
  }

  delete(column: IColumn): void {
    const modalRef = this.modalService.open(ColumnDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.column = column;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
