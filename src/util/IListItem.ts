export interface IListItem {
  getName: () => string,
  setName: (name: string) => void,
  getPosition: () => number,
  getId: () => string,
}