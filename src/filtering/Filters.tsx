import { FilterType } from "./FilterType";
import { InputNumber } from "./components/input-number";
import { InputText } from "./components/input-text";
import { FilterOperations } from "./operations";

export type Filter = Record<'String' | 'Date' | 'Select' | 'MultiSelect' | 'Number' | 'Switch', {
  type: 'string' | 'date' | 'select' | 'multiselect' | 'number' | 'switch',
  Filter: (props: {
    onChange: any, 
    locked?: boolean, 
    value?: any,
    options?: Set<string>,
    trigger?: 'blur' | 'submit' | 'onChange' | 'global',
    commit?: () => void
  }) => JSX.Element,
  Mode?: (props: {onChange: any, locked?: boolean, value?: any, active: keyof typeof FilterOperations}) => JSX.Element,
}>;

export const FilterComponents: Filter = {
  String: {
    type: 'string',
    Filter: InputText,
    Mode: function ({onChange, locked, active}) {
      return (
        <FilterType 
          onChange={onChange}
          locked={locked}
          active={active}
          options={[
            ['Contains', 'includes'], 
            ['Contains (case ins.)', 'includesCaseInsensitive'], 
            ['Starts with', 'startsWith'], 
            ['Ends with', 'endsWith'],
            ['Not equals', 'notEquals'],
            ['Not contains', 'notContains'],
          ]}
        />
      )
    }
  },
  Date: {
    type: 'date',
    Filter: function ({onChange, locked, value}) {
      return (
        <input
          type="date" 
          onChange={event => onChange(event.target.value)}
          disabled={locked}
          value={value ?? ""}
        />
      )
    },
    Mode: function ({onChange, locked, active}) {
      return (
        <FilterType 
          onChange={onChange}
          locked={locked}
          active={active}
          options={[
            ['On', 'on'], 
            ['On or before', 'onOrBefore'], 
            ['On or after', 'onOrAfter']]}
        />
      )
    }
  },
  Select: {
    type: 'select',
    Filter: function ({onChange, locked, value, options}) {
      return (
        <select 
          onChange={event => onChange(Object.values(event.target.selectedOptions).map(
            opt => opt.value
          )?.[0])}
          disabled={locked}
          value={value ?? ""}
        >
          {options && [...options].map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      )
    },
    Mode: function ({onChange, locked, active}) {
      return (
        <FilterType 
          onChange={onChange}
          locked={locked}
          active={active}
          options={[
            ['Equals', 'eq']
          ]}
        />
      )
    }
  },
  MultiSelect: {
    type: 'multiselect',
    Filter: function ({onChange, locked, value, options}) {
      return (
        <select 
          onChange={event => onChange(Object.values(event.target.selectedOptions).map(
            opt => opt.value
          ))}
          disabled={locked}
          value={value ?? [""]}
          multiple
        >
          {options && [...options].map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      )
    },
    Mode: function ({onChange, locked, active}) {
      return (
        <FilterType 
          onChange={onChange}
          locked={locked}
          active={active}
          options={[
            ['Equals', 'eqMulti'],
            ['Equals (case ins.)', 'eqMultiCaseInsensitive'],
          ]}
        />
      )
    }
  },
  Number: {
    type: 'number',
    Filter: InputNumber,
    Mode: function ({onChange, locked, active}) {
      return (
        <FilterType 
          onChange={onChange}
          locked={locked}
          active={active}
          options={[
            ['Equals', 'eqLoose'], 
            ['Lower than or equal to', 'lte'], 
            ['Greater than or equal to', 'gte']
          ]}
        />
      )
    }
  },
  Switch: {
    type: 'switch',
    Filter: function ({onChange, locked, value}) {
      return (
        <input 
          type="checkbox"
          onChange={
            event => {
              onChange(event.target.checked)
            }
          }
          checked={value ?? false}
          disabled={locked}
        />
      )
    }
  }
}