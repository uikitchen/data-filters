import { ColumnDef } from "../../types"
import { IRow } from "./data"

export const columnDefinitions: ColumnDef<IRow>[] = [
  {
    locked: false,
    active: 'includes',
    trigger: 'submit',
    type: 'String',
    path: ['original', 'name']
  },
  {
    locked: false,
    active: 'on',
    type: 'Date',
    path: ['original', 'born']
  },
  {
    locked: false,
    active: 'eqMultiCaseInsensitive',
    value: ['BMW', 'Audi'],
    type: 'MultiSelect',
    path: ['original', 'car']
  },
  {
    locked: false,
    active: 'eq',
    type: 'Select',
    path: ['original', 'city']
  },
  {
    locked: false,
    active: 'eqLoose',
    type: 'Number',
    path: ['original', 'height']
  },
  {
    locked: false,
    active: 'eq',
    type: 'Switch',
    path: ['original', 'online']
  }
]