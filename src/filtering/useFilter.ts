import { always, endsWith, filter, flip, gte, includes, lte, startsWith, where, equals, fromPairs, map, pair, complement, curry, toLower } from 'ramda'
import { useMemo, useState } from 'react'
import { ColumnDef } from '../columns'
import {compareDate, filterMap} from '../utils'
const instance = new ComlinkWorker<typeof import('../worker')>(new URL('../worker', import.meta.url), {type: 'module'})

export const FilterOperations = {
  includes,
  notContains: complement(includes),
  notEquals: complement(equals),
  startsWith,
  endsWith,
  on: curry(compareDate('on')),
  onOrBefore: curry(compareDate('onOrBefore')),
  onOrAfter: curry(compareDate('onOrAfter')),
  lte: flip(lte),
  gte: flip(gte),
  eq: equals,
  eqLoose: curry((input: any, value: any) => input == value),
  eqCaseInsensitive: curry((input: string, value: string) => equals(input, toLower(value))),
  eqMulti: flip(includes),
  eqMultiCaseInsensitive: curry((input: string[], value: string) => flip(includes)(input, toLower(value)))
}

interface WorkerMessage {
  type: "result" | "error";
  payload: number | string;
}

export const useFilter = <T>(columnDefinitions: ColumnDef<T>[], data: any[]) => {
  const [columns, setColumns] = useState(columnDefinitions);
  const [options] = useState<{[key: string]: Set<string>}>(() => {
    const selectColumns = filterMap<ColumnDef<T>, string>(
      e => e.components.type === 'select' || e.components.type === 'multiselect',
      e => e.id,
      columnDefinitions
    )

    if (!selectColumns.length)
      return {};

    return data.reduce((a, c) => {
      selectColumns.forEach(e => a[e].add(c[e].toLowerCase()))
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
  }

  const clearAll = () => {
    setActiveFilters(columnDefinitions.reduce((a, c) => {
      a[c.id] = c?.locked ? c.filter : always(true);
      return a;
    }, {} as any))
    setColumns(columns.map(e => ({...e, value: e.locked ? e.value : ""})))
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
    if (typeof value !== 'boolean' && (!value || value?.length === 0)) {
      _resetFilter(name);
      return;
    }

    setColumns(columns.map(e => e.id === name ? ({...e, value}): {...e}))

    return {filter: FilterOperations[active]}
  }

  const filtered = useMemo(() => filter(where(activeFilters), data), [activeFilters, data])

  return {
    filtered,
    columns,
    setFilter,
    stageFilter,
    commitFilters,
    setMode,
    stageMode,
    clearFilter,
    clearAll,
    options
  }
}