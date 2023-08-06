import { fromPairs, map, path } from 'ramda'
import { useEffect, useState } from 'react'
import { filterMap } from '../utils'
import { WithComponent } from '../types';

export const useSelectData = <T,>(columns: WithComponent<T>[], data: any[]) => {
  const [options, setOptions] = useState<Record<keyof T | any, Set<string>>>();

  useEffect(() => {
    if (!data.length)
      return;

    const selectColumns = filterMap<WithComponent<T>, string[]>(
      e => e.components.type === 'Select' || e.components.type === 'MultiSelect',
      e => e.path as string[],
      columns
    )

    if (!selectColumns.length)
      return;

    const createSetPair = (key: string[]) => [key.join(""), new Set()];
    const base = fromPairs(map<any, any>(createSetPair, selectColumns));

    setOptions(
      data.reduce((a, c) => {
        selectColumns.forEach(e => a[e.join("")].add(path(e, c)))
        return a;
      }, base)
    )
  }, [data]);

  return {
    options
  }
}