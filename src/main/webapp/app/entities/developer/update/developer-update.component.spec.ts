jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DeveloperService } from '../service/developer.service';
import { IDeveloper, Developer } from '../developer.model';

import { DeveloperUpdateComponent } from './developer-update.component';

describe('Component Tests', () => {
  describe('Developer Management Update Component', () => {
    let comp: DeveloperUpdateComponent;
    let fixture: ComponentFixture<DeveloperUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let developerService: DeveloperService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DeveloperUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DeveloperUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DeveloperUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      developerService = TestBed.inject(DeveloperService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const developer: IDeveloper = { id: 456 };

        activatedRoute.data = of({ developer });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(developer));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Developer>>();
        const developer = { id: 123 };
        jest.spyOn(developerService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ developer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: developer }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(developerService.update).toHaveBeenCalledWith(developer);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Developer>>();
        const developer = new Developer();
        jest.spyOn(developerService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ developer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: developer }));
        saveSubject.complete();

        // THEN
        expect(developerService.create).toHaveBeenCalledWith(developer);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Developer>>();
        const developer = { id: 123 };
        jest.spyOn(developerService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ developer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(developerService.update).toHaveBeenCalledWith(developer);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
