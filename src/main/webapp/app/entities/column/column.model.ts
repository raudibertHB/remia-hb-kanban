import { ITask } from 'app/entities/task/task.model';

export interface IColumn {
  id?: number;
  name?: string | null;
  task?: ITask | null;
}

export class Column implements IColumn {
  constructor(public id?: number, public name?: string | null, public task?: ITask | null) {}
}

export function getColumnIdentifier(column: IColumn): number | undefined {
  return column.id;
}
