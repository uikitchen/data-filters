import { allPass, always, drop, filter, multiply, path, take, values } from 'ramda'
import { useMemo, useState } from 'react'
import { useSelectData } from '../../hooks/useSelectData'
import { FilterComponents, FilterTypes } from '../Filters'
import { FilterOperations, FilterOperationsType } from '../operations'
import { ColumnDef, WithComponent } from '../../types'

const TypeMapping: Record<FilterTypes, typeof FilterComponents[keyof typeof FilterComponents]> = {
  String: FilterComponents.String,
  Date: FilterComponents.Date,
  MultiSelect: FilterComponents.MultiSelect,
  Number: FilterComponents.Number,
  Select: FilterComponents.Select,
  Switch: FilterComponents.Switch
}

export const useFilter = <T,>(columnDefinitions: ColumnDef<T>[], data: T[], pageSizeInit?: number) => {
  const [columns, setColumns] = useState<WithComponent<T>[]>(() => {
    return columnDefinitions.map(cd => ({
      ...cd, 
      components: cd.components ? cd.components : TypeMapping[cd.type],
      id: cd.path?.join("")
    })) as WithComponent<T>[]
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeInit ?? data.length);
  const [activeFilters, setActiveFilters] = useState(() => {
    return columns.reduce((a, c) => {
      a[c.id as keyof T] = (val: string) => {
        const getPath = path(c.path as string[], val)
        return c?.value 
          ? (FilterOperations as FilterOperationsType)[c.active](c.value)(getPath) 
          : always(true);
      }
      return a;
    }, {} as Record<keyof T, (input: any) => boolean>)
  });
  const [filterStage, setFilterStage] = useState({});
  const { options } = useSelectData<T>(columns, data);

  const resetPage = () => setPage(1);

  const setFilter = async (id: string, value: any) => {
    _filter(setActiveFilters, _prepareFilters, id, value);
  }

  const stageFilter = (id: string, value: any) => {
    _filter(setFilterStage, _prepareFilters, id, value);
  }

  const stageMode = (id: string, values: (keyof FilterOperationsType)[]) => {
    _filter(setFilterStage, _prepareModeFilters, id, undefined, values[0]);
  }

  const setMode = (id: string, values: (keyof FilterOperationsType)[]) => {
    _filter(setActiveFilters, _prepareModeFilters, id, undefined, values[0]);
  }

  const clearFilter = (name: string) => {
    _resetFilter(name);

    if (pageSizeInit)
      resetPage()
  }

  const clearAll = () => {
    setActiveFilters(columns.reduce((a, c) => {
      a[c.id] = (val: string) => {
        const getPath = path(c.path as string[])
        return c?.locked ? (FilterOperations as FilterOperationsType)[c.active](c.value)(getPath(val)) : always(true);
      }
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

  const _filter = (
    stateSetter: (value: React.SetStateAction<any>) => void,
    prepareFn: (name: keyof T, value: any, active: keyof FilterOperationsType) => any,
    id: string,
    input?: any,
    active?: keyof FilterOperationsType
  ) => {
    const column = columns.filter(e => e.id === id)?.[0];

    if (!column)
      return;
    
    const activeFilter = active ?? column?.active;
    const currentInput = input ?? column?.value;
    const res = prepareFn(column.id as keyof T, currentInput, activeFilter);

    if (res)    
      stateSetter((state: any) => ({
        ...state,
        [column.id as keyof T]: (data: any) => res.filter(currentInput, path(column?.path as string[], data))
      }))
  }

  const _resetFilter = (name: string) => {
    setActiveFilters((prevFilters: any) => ({
      ...prevFilters,
      [name]: always(true)
    }))
    setColumns(columns.map(e => ({...e, value: e.id === name ? "" : e.value})))
  }

  const _prepareModeFilters = (name: keyof T, value: any, active: keyof FilterOperationsType) => {
    const column = columns.filter(e => e.id === name);
    if (!column.length)
      return;

    const filter = (FilterOperations as FilterOperationsType)[active];

    setColumns(columns.map(e => e.id === name ? ({...e, active}): {...e}));

    return {filter, value}
  }

  const _prepareFilters = (name: keyof T, value: any, active: keyof FilterOperationsType) => {
    setColumns(columns.map(e => e.id === name ? ({...e, value}): {...e}))

    if (pageSizeInit)
      resetPage()

    return {filter: (FilterOperations as FilterOperationsType)[active]}
  }

  const filtered = useMemo(() => {
    const filtered = filter(allPass(values(activeFilters)), data);

    return { 
      paged: take(pageSize, drop(multiply((page - 1), pageSize), filtered)),
      number: filtered.length
    };
  }, [activeFilters, data, pageSize, page])

  const prevPage = () => setPage(page => --page);
  const nextPage = () => setPage(page => ++page);
  const goToPage = (page: number) => setPage(page);

  const prevDisabled = page === 1;
  const nextDisabled = (filtered.number / pageSize) < page || filtered.number <= pageSize;

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
      prevPage,
      nextPage,
      prevDisabled,
      nextDisabled,
      goToPage,
      currentPage: page,
      setPageSize
    }
  }
}