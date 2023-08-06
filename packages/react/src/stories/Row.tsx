import { FC, memo } from 'react';
import { IRow } from './data/data';

export const Row: FC<{row: IRow}> = memo(({row}) => {
  return (
    <tr>
      <td>{row.original.name}</td>
      <td>{row.original.born instanceof Date ? row.original.born?.toISOString() : row.original.born}</td>
      <td>{row.original.car}</td>
      <td>{row.original.city}</td>
      <td>{row.original.height}</td>
      <td>{row.original.online ? 'true' : 'false'}</td>
    </tr>
  )
})