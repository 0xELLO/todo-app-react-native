import { ITodoCategories } from '../../domain/ITodoCategories';
import { IListItem } from '../IListItem';

export default class CategoriesListItem implements ITodoCategories, IListItem {
  id: string;
  categoryName: string;
  categorySort: number;
  syncDt?: string | undefined;

  constructor(id: string, categoryName: string, categorySort: number, syncDt: string) {
    this.id = id;
    this.categoryName = categoryName;
    this.categorySort = categorySort;
    this.syncDt = syncDt;
  }

  getName(){return this.categoryName;}
  setName(name: string){(this.categoryName = name);}
  getPosition(){return this.categorySort;}
  getId(){return this.id;}
}
