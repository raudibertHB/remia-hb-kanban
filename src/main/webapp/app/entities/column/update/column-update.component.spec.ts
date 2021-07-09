jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ColumnService } from '../service/column.service';
import { IColumn, Column } from '../column.model';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';

import { ColumnUpdateComponent } from './column-update.component';

describe('Component Tests', () => {
  describe('Column Management Update Component', () => {
    let comp: ColumnUpdateComponent;
    let fixture: ComponentFixture<ColumnUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let columnService: ColumnService;
    let taskService: TaskService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ColumnUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ColumnUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ColumnUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      columnService = TestBed.inject(ColumnService);
      taskService = TestBed.inject(TaskService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Task query and add missing value', () => {
        const column: IColumn = { id: 456 };
        const task: ITask = { id: 2438 };
        column.task = task;

        const taskCollection: ITask[] = [{ id: 48122 }];
        jest.spyOn(taskService, 'query').mockReturnValue(of(new HttpResponse({ body: taskCollection })));
        const additionalTasks = [task];
        const expectedCollection: ITask[] = [...additionalTasks, ...taskCollection];
        jest.spyOn(taskService, 'addTaskToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ column });
        comp.ngOnInit();

        expect(taskService.query).toHaveBeenCalled();
        expect(taskService.addTaskToCollectionIfMissing).toHaveBeenCalledWith(taskCollection, ...additionalTasks);
        expect(comp.tasksSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const column: IColumn = { id: 456 };
        const task: ITask = { id: 50316 };
        column.task = task;

        activatedRoute.data = of({ column });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(column));
        expect(comp.tasksSharedCollection).toContain(task);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Column>>();
        const column = { id: 123 };
        jest.spyOn(columnService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ column });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: column }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(columnService.update).toHaveBeenCalledWith(column);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Column>>();
        const column = new Column();
        jest.spyOn(columnService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ column });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: column }));
        saveSubject.complete();

        // THEN
        expect(columnService.create).toHaveBeenCalledWith(column);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Column>>();
        const column = { id: 123 };
        jest.spyOn(columnService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ column });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(columnService.update).toHaveBeenCalledWith(column);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackTaskById', () => {
        it('Should return tracked Task primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTaskById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
