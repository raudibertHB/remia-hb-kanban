import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IColumn, Column } from '../column.model';

import { ColumnService } from './column.service';

describe('Service Tests', () => {
  describe('Column Service', () => {
    let service: ColumnService;
    let httpMock: HttpTestingController;
    let elemDefault: IColumn;
    let expectedResult: IColumn | IColumn[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ColumnService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Column', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Column()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Column', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Column', () => {
        const patchObject = Object.assign({}, new Column());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Column', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Column', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addColumnToCollectionIfMissing', () => {
        it('should add a Column to an empty array', () => {
          const column: IColumn = { id: 123 };
          expectedResult = service.addColumnToCollectionIfMissing([], column);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(column);
        });

        it('should not add a Column to an array that contains it', () => {
          const column: IColumn = { id: 123 };
          const columnCollection: IColumn[] = [
            {
              ...column,
            },
            { id: 456 },
          ];
          expectedResult = service.addColumnToCollectionIfMissing(columnCollection, column);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Column to an array that doesn't contain it", () => {
          const column: IColumn = { id: 123 };
          const columnCollection: IColumn[] = [{ id: 456 }];
          expectedResult = service.addColumnToCollectionIfMissing(columnCollection, column);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(column);
        });

        it('should add only unique Column to an array', () => {
          const columnArray: IColumn[] = [{ id: 123 }, { id: 456 }, { id: 91844 }];
          const columnCollection: IColumn[] = [{ id: 123 }];
          expectedResult = service.addColumnToCollectionIfMissing(columnCollection, ...columnArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const column: IColumn = { id: 123 };
          const column2: IColumn = { id: 456 };
          expectedResult = service.addColumnToCollectionIfMissing([], column, column2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(column);
          expect(expectedResult).toContain(column2);
        });

        it('should accept null and undefined values', () => {
          const column: IColumn = { id: 123 };
          expectedResult = service.addColumnToCollectionIfMissing([], null, column, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(column);
        });

        it('should return initial array if no Column is added', () => {
          const columnCollection: IColumn[] = [{ id: 123 }];
          expectedResult = service.addColumnToCollectionIfMissing(columnCollection, undefined, null);
          expect(expectedResult).toEqual(columnCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
