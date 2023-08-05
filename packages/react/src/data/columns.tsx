import { Filter, FilterComponents } from "../filtering/Filters"
import { FilterOperations } from '../filtering/operations'
import { IRow } from "./data"

export type ColumnDef<T> = {
  value?: any, 
  locked?: boolean, 
  id: keyof T, 
  active: keyof typeof FilterOperations, 
  components?: typeof FilterComponents[keyof typeof FilterComponents],
  trigger?: 'blur' | 'submit' | 'onChange',
  type: Filter["String"]["type"]
}

export const columnDefinitions: ColumnDef<IRow>[] = [
  {
    id: 'name',
    locked: false,
    active: 'includes',
    trigger: 'submit',
    type: 'String'
  },
  {
    locked: false,
    id: 'born',
    active: 'on',
    type: 'Date'
  },
  {
    locked: true,
    id: 'car',
    active: 'eqMultiCaseInsensitive',
    value: ['BMW', 'Audi'],
    type: 'MultiSelect',
  },
  {
    locked: false,
    id: 'city',
    active: 'eq',
    type: 'Select',
  },
  {
    locked: false,
    id: 'height',
    active: 'eqLoose',
    type: 'Number'
  },
  {
    locked: false,
    id: 'online',
    active: 'eq',
    type: 'Switch'
  }
]