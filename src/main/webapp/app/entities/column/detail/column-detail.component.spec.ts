import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ColumnDetailComponent } from './column-detail.component';

describe('Component Tests', () => {
  describe('Column Management Detail Component', () => {
    let comp: ColumnDetailComponent;
    let fixture: ComponentFixture<ColumnDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ColumnDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ column: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ColumnDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ColumnDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load column on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.column).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
