import type { Filter } from "../Filters"

type Props = Parameters<Filter["String"]["Filter"]>[0] & {type: 'text' | 'number'}

export const InputBase = ({onChange, locked, value, trigger = 'onChange', type, commit}: Props) => {
  const _handleOnChange = (value: any) => {
    onChange(value)
  }

  const _handleBlur = () => {
    commit && commit()
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      commit && commit()
    }
  };

  return (
    <input 
      type={type}
      value={value ?? ""} 
      onChange={event => _handleOnChange(event.target.value)}
      onBlur={trigger === 'blur' || trigger !== 'global' ? _handleBlur : undefined}
      onKeyDown={trigger === 'submit' || trigger !== 'global' ? handleKeyDown : undefined}
      disabled={locked}
    />
  )
}