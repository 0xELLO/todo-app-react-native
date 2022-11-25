import { ITodoPriorities } from '../domain/ITodoPriorities';
import { IListItem } from './IListItem';

export default class PrioritiesListItem implements ITodoPriorities, IListItem {
  id: string;
  priorityName: string;
  prioritySort: number;
  syncDt?: string | undefined;

  constructor(id: string, PriorityName: string, PrioritySort: number, syncDt: string) {
    this.id = id;
    this.priorityName = PriorityName;
    this.prioritySort = PrioritySort;
    this.syncDt = syncDt;
  }

  getName(){return this.priorityName;}
  setName(name: string){(this.priorityName = name);}
  getPosition(){return this.prioritySort;}
  getId(){return this.id;}
}
