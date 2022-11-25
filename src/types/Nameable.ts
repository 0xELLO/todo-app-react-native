export interface Nameable {
  getName: () => string,
  setName: (name: string) => void,
  getPosition: () => number,
  getId: () => string,
}