import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IColumn, Column } from '../column.model';
import { ColumnService } from '../service/column.service';

@Injectable({ providedIn: 'root' })
export class ColumnRoutingResolveService implements Resolve<IColumn> {
  constructor(protected service: ColumnService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IColumn> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((column: HttpResponse<Column>) => {
          if (column.body) {
            return of(column.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Column());
  }
}
