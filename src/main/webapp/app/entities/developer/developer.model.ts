import { ITask } from 'app/entities/task/task.model';

export interface IDeveloper {
  id?: number;
  name?: string | null;
  tasks?: ITask[] | null;
}

export class Developer implements IDeveloper {
  constructor(public id?: number, public name?: string | null, public tasks?: ITask[] | null) {}
}

export function getDeveloperIdentifier(developer: IDeveloper): number | undefined {
  return developer.id;
}
