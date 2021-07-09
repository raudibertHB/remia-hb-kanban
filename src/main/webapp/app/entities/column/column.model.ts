import { ITask } from 'app/entities/task/task.model';

export interface IColumn {
  id?: number;
  task?: ITask | null;
}

export class Column implements IColumn {
  constructor(public id?: number, public task?: ITask | null) {}
}

export function getColumnIdentifier(column: IColumn): number | undefined {
  return column.id;
}
