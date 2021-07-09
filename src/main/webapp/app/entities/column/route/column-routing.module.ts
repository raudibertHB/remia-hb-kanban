import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ColumnComponent } from '../list/column.component';
import { ColumnDetailComponent } from '../detail/column-detail.component';
import { ColumnUpdateComponent } from '../update/column-update.component';
import { ColumnRoutingResolveService } from './column-routing-resolve.service';

const columnRoute: Routes = [
  {
    path: '',
    component: ColumnComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ColumnDetailComponent,
    resolve: {
      column: ColumnRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ColumnUpdateComponent,
    resolve: {
      column: ColumnRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ColumnUpdateComponent,
    resolve: {
      column: ColumnRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(columnRoute)],
  exports: [RouterModule],
})
export class ColumnRoutingModule {}
