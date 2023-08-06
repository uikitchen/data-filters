import { Filter, FilterComponents } from "./filtering/Filters";
import { FilterOperationsType } from "./filtering/operations";

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type DeepKeys<T, D extends Prev[number] = 9> = T extends object
  ? [D] extends [never] ? never : {
      [K in keyof T]: [K, ...DeepKeys<T[K], Prev[D]>];
    }[keyof T]
  : [];

export type WithComponent<T> = ColumnDef<T> & {
  components: Required<typeof FilterComponents[keyof typeof FilterComponents]>;
  id: string
};

export type ColumnDef<T> = {
  value?: any, 
  locked?: boolean, 
  path: DeepKeys<Partial<T>>,
  active: keyof FilterOperationsType, 
  components?: typeof FilterComponents[keyof typeof FilterComponents],
  trigger?: 'blur' | 'submit' | 'onChange',
  type: Filter["String"]["type"]
}