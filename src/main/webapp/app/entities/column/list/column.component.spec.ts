import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ColumnService } from '../service/column.service';

import { ColumnComponent } from './column.component';

describe('Component Tests', () => {
  describe('Column Management Component', () => {
    let comp: ColumnComponent;
    let fixture: ComponentFixture<ColumnComponent>;
    let service: ColumnService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ColumnComponent],
      })
        .overrideTemplate(ColumnComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ColumnComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ColumnService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.columns?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
