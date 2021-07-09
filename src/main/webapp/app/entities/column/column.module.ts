import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ColumnComponent } from './list/column.component';
import { ColumnDetailComponent } from './detail/column-detail.component';
import { ColumnUpdateComponent } from './update/column-update.component';
import { ColumnDeleteDialogComponent } from './delete/column-delete-dialog.component';
import { ColumnRoutingModule } from './route/column-routing.module';

@NgModule({
  imports: [SharedModule, ColumnRoutingModule],
  declarations: [ColumnComponent, ColumnDetailComponent, ColumnUpdateComponent, ColumnDeleteDialogComponent],
  entryComponents: [ColumnDeleteDialogComponent],
})
export class ColumnModule {}
