import { FC } from 'react';
import { ColumnDef } from './columns';
import { useFilter } from './filtering/useFilter';
import { IRow } from './data';
import { Row } from './Row';

export const App: FC<{columnDefinitions: ColumnDef<IRow>[], data: any[]}> = ({columnDefinitions, data}) => {
  const {
    columns,
    filtered,
    setFilter,
    clearFilter,
    clearAll,
    stageFilter,
    commitFilters,
    setMode,
    options
  } = useFilter(columnDefinitions, data);

  return (
    <table>
      <thead>
        <tr>
          {
            columns.map(({id, locked, components: {Filter, Mode}, active, value, trigger}) => {
              return (
                <th key={id}>
                  {id}
                  <Filter 
                    onChange={
                      (value: any) =>
                        trigger !== 'onChange' && trigger
                          ? stageFilter(id, value, active)
                          : setFilter(id, value, active)
                    } 
                    locked={locked}
                    value={value}
                    options={options?.[id]}
                    trigger={trigger}
                    commit={commitFilters}
                  />
                  {
                    Mode && (
                      <Mode 
                        onChange={(e: any) => setMode(id, e)} 
                        locked={locked} 
                        value={value}
                        active={active}
                      />
                    )
                  }
                  <button 
                    disabled={locked || (typeof value !== 'boolean' && !value)} 
                    onClick={() => clearFilter(id)}
                  >
                    x
                  </button>
                </th>
              )
            })
          }
        </tr>
        <tr>
          <th>{filtered.length} records found</th>
          <th><button onClick={clearAll}>clear</button></th>
          <th><button onClick={commitFilters}>apply filter</button></th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((row, i) => {
          return (
            <Row key={i} row={row}/>
          )
        })}
      </tbody>
    </table>
  )
}

export default App
