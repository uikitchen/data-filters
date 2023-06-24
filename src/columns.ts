import { flip, includes } from 'ramda'
import { IRow } from "./data"
import { FilterComponents } from "./filtering/Filters"
import { FilterOperations } from './filtering/operations'

export type ColumnDef<T> = {
  filter?: (pred: any) => boolean, 
  value?: any, 
  locked?: boolean, 
  id: keyof T, 
  active: keyof typeof FilterOperations, 
  components: typeof FilterComponents[keyof typeof FilterComponents],
  trigger?: 'blur' | 'submit' | 'onChange'
}

export const columnDefinitions: ColumnDef<IRow>[] = [
  {
      // filter: includes('joe'),
      // value: 'joe',
      id: 'name',
      locked: false,
      active: 'includes',
      components: FilterComponents.String,
      trigger: 'submit'
  },
  {
      locked: false,
      id: 'born',
      active: 'on',
      components: FilterComponents.Date
  },
  {
      locked: false,
      id: 'car',
      active: 'eqMultiCaseInsensitive',
      value: ['BMW', 'Audi'],
      filter: (val) => {
        const lower = val.toLowerCase()
        return flip(includes)(['bmw', 'audi'])(lower)
      },
      components: FilterComponents.MultiSelect
  },
  {
      locked: false,
      id: 'height',
      active: 'eqLoose',
      components: FilterComponents.Number
  },
  {
      locked: false,
      id: 'online',
      active: 'eq',
      components: FilterComponents.Switch
  },
]