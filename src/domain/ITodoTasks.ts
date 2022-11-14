export interface ITodoTasks {
  id?: string;
  taskName: string;
  taskSort: number;
  createdDt: string;
  dueDt: string;
  isCompleted: boolean;
  isArchived: boolean;
  todoCategoryId: string;
  todoPriorityId: string;
  syncDt: string;
}
