jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TaskService } from '../service/task.service';
import { ITask, Task } from '../task.model';
import { IDeveloper } from 'app/entities/developer/developer.model';
import { DeveloperService } from 'app/entities/developer/service/developer.service';

import { TaskUpdateComponent } from './task-update.component';

describe('Component Tests', () => {
  describe('Task Management Update Component', () => {
    let comp: TaskUpdateComponent;
    let fixture: ComponentFixture<TaskUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let taskService: TaskService;
    let developerService: DeveloperService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TaskUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TaskUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TaskUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      taskService = TestBed.inject(TaskService);
      developerService = TestBed.inject(DeveloperService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Developer query and add missing value', () => {
        const task: ITask = { id: 456 };
        const developer: IDeveloper = { id: 39525 };
        task.developer = developer;

        const developerCollection: IDeveloper[] = [{ id: 48333 }];
        jest.spyOn(developerService, 'query').mockReturnValue(of(new HttpResponse({ body: developerCollection })));
        const additionalDevelopers = [developer];
        const expectedCollection: IDeveloper[] = [...additionalDevelopers, ...developerCollection];
        jest.spyOn(developerService, 'addDeveloperToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ task });
        comp.ngOnInit();

        expect(developerService.query).toHaveBeenCalled();
        expect(developerService.addDeveloperToCollectionIfMissing).toHaveBeenCalledWith(developerCollection, ...additionalDevelopers);
        expect(comp.developersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const task: ITask = { id: 456 };
        const developer: IDeveloper = { id: 6078 };
        task.developer = developer;

        activatedRoute.data = of({ task });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(task));
        expect(comp.developersSharedCollection).toContain(developer);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Task>>();
        const task = { id: 123 };
        jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ task });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: task }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(taskService.update).toHaveBeenCalledWith(task);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Task>>();
        const task = new Task();
        jest.spyOn(taskService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ task });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: task }));
        saveSubject.complete();

        // THEN
        expect(taskService.create).toHaveBeenCalledWith(task);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Task>>();
        const task = { id: 123 };
        jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ task });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(taskService.update).toHaveBeenCalledWith(task);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackDeveloperById', () => {
        it('Should return tracked Developer primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDeveloperById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
