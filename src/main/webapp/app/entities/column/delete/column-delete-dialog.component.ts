import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IColumn } from '../column.model';
import { ColumnService } from '../service/column.service';

@Component({
  templateUrl: './column-delete-dialog.component.html',
})
export class ColumnDeleteDialogComponent {
  column?: IColumn;

  constructor(protected columnService: ColumnService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.columnService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
