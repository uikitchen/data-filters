import type { Filter } from "../Filters"
import { InputBase } from "./input-base"

type Props = Filter["String"]["Filter"]

export const InputText: Props = (props) => {
  return (
    <InputBase {...props} type="text"/>
  )
}