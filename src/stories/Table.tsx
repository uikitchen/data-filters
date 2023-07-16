import { FC } from 'react';
import { ColumnDef } from '../data/columns';
import { useFilter } from '../filtering/hooks/useFilter';
import { IRow, useData } from '../data/data';
import { Row } from './Row';

export const Table: FC<{columnDefinitions: ColumnDef<IRow>[]}> = ({columnDefinitions}) => {

  const data = useData();
  
  const {
    columns,
    filtered,
    found,
    setFilter,
    clearFilter,
    clearAll,
    stageFilter,
    commitFilters,
    setMode,
    options,
    paging: {
      currentPage,
      nextPage,
      prevPage,
      nextDisabled,
      prevDisabled
    }
  } = useFilter(columnDefinitions, data, 10);

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
          <th>{found} records found</th>
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
      <tfoot>
        <tr>
          <th>
            <button onClick={prevPage} disabled={prevDisabled}>prev</button>
            <button onClick={nextPage} disabled={nextDisabled}>next</button>
          </th>
          <th>{currentPage}</th>
        </tr>
      </tfoot>
    </table>
  )
}
