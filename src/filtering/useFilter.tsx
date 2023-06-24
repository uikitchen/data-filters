import { always, drop, filter, flip, fromPairs, map, multiply, pair, take, where } from 'ramda'
import { useMemo, useState } from 'react'
import { ColumnDef } from '../columns'
import { filterMap } from '../utils'
import { FilterOperations } from './operations'
// const instance = new ComlinkWorker<typeof import('../worker')>(new URL('../worker', import.meta.url), {type: 'module'})

// interface WorkerMessage {
//   type: "result" | "error";
//   payload: number | string;
// }

export const useFilter = <T,>(columnDefinitions: ColumnDef<T>[], data: any[], pageSizeInit?: number) => {
  const [columns, setColumns] = useState(columnDefinitions);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeInit ?? data.length);
  const [options] = useState<{[key: string]: Set<string>}>(() => {
    const selectColumns = filterMap<ColumnDef<T>, string>(
      e => e.components.type === 'select' || e.components.type === 'multiselect',
      e => e.id,
      columnDefinitions
    )

    if (!selectColumns.length)
      return {};

    return data.reduce((a, c) => {
      selectColumns.forEach(e => a[e].add(c[e]))
      return a;
    }, fromPairs(map<any, any>(flip(pair)(new Set), selectColumns)))
  });
  const [activeFilters, setActiveFilters] = useState(() => {
    return columnDefinitions.reduce((a, c) => {
      a[c.id] = c?.filter ?? always(true);
      return a;
    }, {} as Record<keyof T, typeof FilterOperations[keyof typeof FilterOperations]>)
  });
  const [filterStage, setFilterStage] = useState({});

  const resetPage = () => setPage(1);

  const setFilter = async (name: string, value: any, active: keyof typeof FilterOperations) => {
    const t0 = performance.now();
    const res = _prepareFilters(name, value, active);
    // const result = await instance.add(2, 3)
    // console.log(result)
    if (res) {
      setActiveFilters((prevFilters) => ({
        ...prevFilters,
        //@ts-ignore
        [name]: res.filter(value)
      }));
    }
    const t1 = performance.now();
    console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
  }

  const stageFilter = (name: string, value: any, active: keyof typeof FilterOperations) => {
    const res = _prepareFilters(name, value, active);

    if (res)    
      setFilterStage(staged => ({
        ...staged,
        //@ts-ignore
        [name]: res.filter(value)
      }))
  }

  const stageMode = (name: string, values: (keyof typeof FilterOperations)[]) => {
    const res = _prepareModeFilters(name, values);

    if (res)
      setFilterStage(staged => ({
        ...staged,
        [name]: res.filter(res.value)
      }))
  }

  const setMode = (name: string, values: (keyof typeof FilterOperations)[]) => {
    const res = _prepareModeFilters(name, values);

    if (res)
      setActiveFilters((prevFilters: any) => ({
        ...prevFilters,
        [name]: res.filter(res.value)
      }))
  }

  const clearFilter = (name: string) => {
    _resetFilter(name);

    if (pageSizeInit)
      resetPage()
  }

  const clearAll = () => {
    setActiveFilters(columnDefinitions.reduce((a, c) => {
      a[c.id] = c?.locked ? c.filter : always(true);
      return a;
    }, {} as any))
    setColumns(columns.map(e => ({...e, value: e.locked ? e.value : ""})))

    if (pageSizeInit)
      resetPage()
  }

  const commitFilters = () => {
    setActiveFilters((filters: any) => ({
      ...filters,
      ...filterStage
    }));
    setFilterStage({});
  }

  const _resetFilter = (name: string) => {
    setActiveFilters((prevFilters: any) => ({
      ...prevFilters,
      [name]: always(true)
    }))
    setColumns(columns.map(e => e.id === name ? ({...e, value: ""}): {...e}))
  }

  const _prepareModeFilters = (name: string, values: (keyof typeof FilterOperations)[]) => {
    const column = columns.filter(e => e.id === name);
    if (!column.length)
      return;

    const filter: (value: any) => any = FilterOperations[values[0]];
    const value = column[0].value ?? "";

    setColumns(columns.map(e => e.id === name ? ({...e, active: values[0]}): {...e}));

    return {filter, value}
  }

  const _prepareFilters = (name: string, value: any, active: keyof typeof FilterOperations) => {
    setColumns(columns.map(e => e.id === name ? ({...e, value}): {...e}))

    if (pageSizeInit)
      resetPage()

    return {filter: FilterOperations[active]}
  }

  const filtered = useMemo(() => {
    const filtered = filter(where(activeFilters), data);

    return { 
      paged: take(pageSize, drop(multiply((page - 1), pageSize), filtered)),
      number: filtered.length
    };
  }, [activeFilters, data, pageSize, page])

  const prevPage = () => setPage(page => --page);
  const nextPage = () => setPage(page => ++page);
  const goToPage = (page: number) => setPage(page);

  const prevDisabled = page === 1;
  const nextDisabled = (filtered.number / pageSize) < page + 1 || filtered.number <= pageSize;

  const prevButton = useMemo(() => (props: any) => <button onClick={prevPage} disabled={prevDisabled} {...props}>prev</button>, [prevDisabled])
  const nextButton = useMemo(() => (props: any) => <button onClick={nextPage} disabled={nextDisabled} {...props}>next</button>, [nextDisabled])

  return {
    filtered: filtered.paged,
    found: filtered.number,
    columns,
    setFilter,
    stageFilter,
    commitFilters,
    setMode,
    stageMode,
    clearFilter,
    clearAll,
    options,
    paging: {
      Prev: prevButton,
      Next: nextButton,
      goToPage,
      currentPage: page
    }
  }
}