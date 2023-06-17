import { FC, memo } from 'react';

export const Row: FC<{row: any}> = memo(({row}) => {
  return (
    <tr>
      <td>{row.name}</td>
      <td>{row.born instanceof Date ? row.born?.toISOString() : row.born}</td>
      <td>{row.car}</td>
      <td>{row.height}</td>
      <td>{row.online ? 'true' : 'false'}</td>
    </tr>
  )
})