import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IColumn, getColumnIdentifier } from '../column.model';

export type EntityResponseType = HttpResponse<IColumn>;
export type EntityArrayResponseType = HttpResponse<IColumn[]>;

@Injectable({ providedIn: 'root' })
export class ColumnService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/columns');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(column: IColumn): Observable<EntityResponseType> {
    return this.http.post<IColumn>(this.resourceUrl, column, { observe: 'response' });
  }

  update(column: IColumn): Observable<EntityResponseType> {
    return this.http.put<IColumn>(`${this.resourceUrl}/${getColumnIdentifier(column) as number}`, column, { observe: 'response' });
  }

  partialUpdate(column: IColumn): Observable<EntityResponseType> {
    return this.http.patch<IColumn>(`${this.resourceUrl}/${getColumnIdentifier(column) as number}`, column, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IColumn>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IColumn[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addColumnToCollectionIfMissing(columnCollection: IColumn[], ...columnsToCheck: (IColumn | null | undefined)[]): IColumn[] {
    const columns: IColumn[] = columnsToCheck.filter(isPresent);
    if (columns.length > 0) {
      const columnCollectionIdentifiers = columnCollection.map(columnItem => getColumnIdentifier(columnItem)!);
      const columnsToAdd = columns.filter(columnItem => {
        const columnIdentifier = getColumnIdentifier(columnItem);
        if (columnIdentifier == null || columnCollectionIdentifiers.includes(columnIdentifier)) {
          return false;
        }
        columnCollectionIdentifiers.push(columnIdentifier);
        return true;
      });
      return [...columnsToAdd, ...columnCollection];
    }
    return columnCollection;
  }
}
