import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDeveloper } from '../developer.model';
import { DeveloperService } from '../service/developer.service';
import { DeveloperDeleteDialogComponent } from '../delete/developer-delete-dialog.component';

@Component({
  selector: 'jhi-developer',
  templateUrl: './developer.component.html',
})
export class DeveloperComponent implements OnInit {
  developers?: IDeveloper[];
  isLoading = false;

  constructor(protected developerService: DeveloperService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.developerService.query().subscribe(
      (res: HttpResponse<IDeveloper[]>) => {
        this.isLoading = false;
        this.developers = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDeveloper): number {
    return item.id!;
  }

  delete(developer: IDeveloper): void {
    const modalRef = this.modalService.open(DeveloperDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.developer = developer;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
