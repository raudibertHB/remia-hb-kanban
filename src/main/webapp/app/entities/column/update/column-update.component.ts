import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IColumn, Column } from '../column.model';
import { ColumnService } from '../service/column.service';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';

@Component({
  selector: 'jhi-column-update',
  templateUrl: './column-update.component.html',
})
export class ColumnUpdateComponent implements OnInit {
  isSaving = false;

  tasksSharedCollection: ITask[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    task: [],
  });

  constructor(
    protected columnService: ColumnService,
    protected taskService: TaskService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ column }) => {
      this.updateForm(column);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const column = this.createFromForm();
    if (column.id !== undefined) {
      this.subscribeToSaveResponse(this.columnService.update(column));
    } else {
      this.subscribeToSaveResponse(this.columnService.create(column));
    }
  }

  trackTaskById(index: number, item: ITask): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IColumn>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(column: IColumn): void {
    this.editForm.patchValue({
      id: column.id,
      name: column.name,
      task: column.task,
    });

    this.tasksSharedCollection = this.taskService.addTaskToCollectionIfMissing(this.tasksSharedCollection, column.task);
  }

  protected loadRelationshipsOptions(): void {
    this.taskService
      .query()
      .pipe(map((res: HttpResponse<ITask[]>) => res.body ?? []))
      .pipe(map((tasks: ITask[]) => this.taskService.addTaskToCollectionIfMissing(tasks, this.editForm.get('task')!.value)))
      .subscribe((tasks: ITask[]) => (this.tasksSharedCollection = tasks));
  }

  protected createFromForm(): IColumn {
    return {
      ...new Column(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      task: this.editForm.get(['task'])!.value,
    };
  }
}
