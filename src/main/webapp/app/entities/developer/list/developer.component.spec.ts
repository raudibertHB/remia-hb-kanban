import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DeveloperService } from '../service/developer.service';

import { DeveloperComponent } from './developer.component';

describe('Component Tests', () => {
  describe('Developer Management Component', () => {
    let comp: DeveloperComponent;
    let fixture: ComponentFixture<DeveloperComponent>;
    let service: DeveloperService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DeveloperComponent],
      })
        .overrideTemplate(DeveloperComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DeveloperComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(DeveloperService);

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
      expect(comp.developers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
