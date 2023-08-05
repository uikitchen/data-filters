import { flip, fromPairs, map, pair } from 'ramda'
import { useEffect, useState } from 'react'
import { WithComponent } from '../filtering/hooks/useFilter'
import { filterMap } from '../utils'

export const useSelectData = <T,>(columns: WithComponent<T>[], data: any[]) => {
  const [options, setOptions] = useState<Record<keyof T, Set<string>>>();

  useEffect(() => {
    if (!data.length)
      return;

    const selectColumns = filterMap<WithComponent<T>, string>(
      e => e.components.type === 'Select' || e.components.type === 'MultiSelect',
      e => e.id,
      columns
    )

    if (!selectColumns.length)
      return;

    const createSetPair = (key: string) => [key, new Set()];
    const base = fromPairs(map<any, any>(createSetPair, selectColumns));

    setOptions(
      data.reduce((a, c) => {
        selectColumns.forEach(e => a[e].add(c[e]))
        return a;
      }, base)
    )
  }, [data]);

  return {
    options
  }
}