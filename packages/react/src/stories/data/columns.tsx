import { ColumnDef } from "../../types"
import { IRow } from "./data"

export const columnDefinitions: ColumnDef<IRow>[] = [
  {
    locked: false,
    active: 'includes',
    trigger: 'submit',
    type: 'String',
    path: ['original', 'name'],
    label: 'Name'
  },
  {
    locked: false,
    active: 'on',
    type: 'Date',
    path: ['original', 'born'],
    label: 'Born'
  },
  {
    locked: false,
    active: 'eqMultiCaseInsensitive',
    value: ['BMW', 'Audi'],
    type: 'MultiSelect',
    path: ['original', 'car'],
    label: 'Car'
  },
  {
    locked: false,
    active: 'eq',
    type: 'Select',
    path: ['original', 'city'],
    label: 'City'
  },
  {
    locked: false,
    active: 'eqLoose',
    type: 'Number',
    path: ['original', 'height'],
    label: 'Height'
  },
  {
    locked: false,
    active: 'eq',
    type: 'Switch',
    path: ['original', 'online'],
    label: 'Online'
  }
]