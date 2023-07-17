import { always, drop, filter, multiply, take, where } from 'ramda'
import { useMemo, useState } from 'react'
import { ColumnDef } from '../../data/columns'
import { useSelectData } from '../../hooks/useSelectData'
import { FilterComponents, FilterTypes } from '../Filters'
import { FilterOperations } from '../operations'

const TypeMapping: Record<FilterTypes, typeof FilterComponents[keyof typeof FilterComponents]> = {
  String: FilterComponents.String,
  Date: FilterComponents.Date,
  MultiSelect: FilterComponents.MultiSelect,
  Number: FilterComponents.Number,
  Select: FilterComponents.Select,
  Switch: FilterComponents.Switch
}

export type WithComponent<T> = ColumnDef<T> & {
  components: Required<typeof FilterComponents[keyof typeof FilterComponents]>;
};

export const useFilter = <T,>(columnDefinitions: ColumnDef<T>[], data: any[], pageSizeInit?: number) => {
  const [columns, setColumns] = useState<WithComponent<T>[]>(() => {
    return columnDefinitions.map(cd => ({
      ...cd, 
      components: cd.components ? cd.components : TypeMapping[cd.type]
    })) as WithComponent<T>[]
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeInit ?? data.length);
  const [activeFilters, setActiveFilters] = useState(() => {
    return columnDefinitions.reduce((a, c) => {
      a[c.id] = c?.filter ?? always(true);
      return a;
    }, {} as Record<keyof T, typeof FilterOperations[keyof typeof FilterOperations]>)
  });
  const [filterStage, setFilterStage] = useState({});
  const { options } = useSelectData(columns, data);

  const resetPage = () => setPage(1);

  const setFilter = async (name: keyof T, value: any, active: keyof typeof FilterOperations) => {
    const res = _prepareFilters(name, value, active);
    if (res) {
      setActiveFilters((prevFilters) => ({
        ...prevFilters,
        //@ts-ignore
        [name]: res.filter(value)
      }));
    }
  }

  const stageFilter = (name: keyof T, value: any, active: keyof typeof FilterOperations) => {
    const res = _prepareFilters(name, value, active);

    if (res)    
      setFilterStage(staged => ({
        ...staged,
        //@ts-ignore
        [name]: res.filter(value)
      }))
  }

  const stageMode = (name: keyof T, values: (keyof typeof FilterOperations)[]) => {
    const res = _prepareModeFilters(name, values);

    if (res)
      setFilterStage(staged => ({
        ...staged,
        [name]: res.filter(res.value)
      }))
  }

  const setMode = (name: keyof T, values: (keyof typeof FilterOperations)[]) => {
    const res = _prepareModeFilters(name, values);

    if (res)
      setActiveFilters((prevFilters: any) => ({
        ...prevFilters,
        [name]: res.filter(res.value)
      }))
  }

  const clearFilter = (name: keyof T) => {
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

  const _resetFilter = (name: keyof T) => {
    setActiveFilters((prevFilters: any) => ({
      ...prevFilters,
      [name]: always(true)
    }))
    setColumns(columns.map(e => e.id === name ? ({...e, value: ""}): {...e}))
  }

  const _prepareModeFilters = (name: keyof T, values: (keyof typeof FilterOperations)[]) => {
    const column = columns.filter(e => e.id === name);
    if (!column.length)
      return;

    const filter: (value: any) => any = FilterOperations[values[0]];
    const value = column[0].value ?? "";

    setColumns(columns.map(e => e.id === name ? ({...e, active: values[0]}): {...e}));

    return {filter, value}
  }

  const _prepareFilters = (name: keyof T, value: any, active: keyof typeof FilterOperations) => {
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