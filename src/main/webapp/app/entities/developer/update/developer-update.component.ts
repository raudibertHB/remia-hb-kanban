import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDeveloper, Developer } from '../developer.model';
import { DeveloperService } from '../service/developer.service';

@Component({
  selector: 'jhi-developer-update',
  templateUrl: './developer-update.component.html',
})
export class DeveloperUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
  });

  constructor(protected developerService: DeveloperService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ developer }) => {
      this.updateForm(developer);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const developer = this.createFromForm();
    if (developer.id !== undefined) {
      this.subscribeToSaveResponse(this.developerService.update(developer));
    } else {
      this.subscribeToSaveResponse(this.developerService.create(developer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDeveloper>>): void {
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

  protected updateForm(developer: IDeveloper): void {
    this.editForm.patchValue({
      id: developer.id,
      name: developer.name,
    });
  }

  protected createFromForm(): IDeveloper {
    return {
      ...new Developer(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
