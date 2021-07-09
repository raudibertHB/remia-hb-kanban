import { IDeveloper } from 'app/entities/developer/developer.model';

export interface ITask {
  id?: number;
  title?: string | null;
  description?: string | null;
  developer?: IDeveloper | null;
}

export class Task implements ITask {
  constructor(public id?: number, public title?: string | null, public description?: string | null, public developer?: IDeveloper | null) {}
}

export function getTaskIdentifier(task: ITask): number | undefined {
  return task.id;
}
