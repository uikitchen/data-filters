import type { Filter } from "../Filters"
import { InputBase } from "./input-base"

type Props = Filter["String"]["Filter"]

export const InputNumber: Props = (props) => {
  return (
    <InputBase {...props} type="number"/>
  )
}