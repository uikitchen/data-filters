import { FC } from "react"
import { FilterOperations } from "./useFilter"

type Props = {
  options: [string, keyof typeof FilterOperations][], 
  onChange: any, 
  locked?: boolean,
  active: keyof typeof FilterOperations
}

export const FilterType: FC<Props> = ({options, onChange, locked, active}) => {
  return (
    <select 
      name="type" 
      id="type"
      disabled={locked}
      value={active}
      onChange={event => onChange(Object.values(event.target.selectedOptions).map(
        opt => opt.value
      ))}
    >
      {
        options.map(([name, value], i) => (
          <option key={i} value={value}>{name}</option>
        ))
      }
    </select>
  )
}