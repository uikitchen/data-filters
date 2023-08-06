import { replace, curry } from 'ramda';

export function filterMap<T, K>(filterFn: (p: T) => boolean, mapFn: (a: T) => K, data: T[]): K[] {
	return data.reduce((a: any, c: T) => {
		if (filterFn(c)) 
      a.push(mapFn(c));
    return a;
	}, []);
}

export const compareDate = curry((cond: 'on' | 'onOrBefore' | 'onOrAfter', a: string, b: Date | string) => {
  const isDate = b instanceof Date;
  const dateOnRow = isDate ? b : new Date(/(?=.*T)(?=.*Z).*/g.test(b) ? b : replace(/-/g, ',', b));
  const dateFromSelector = new Date(a);

  const equals = (
    dateFromSelector.getFullYear() === dateOnRow.getFullYear() && 
    dateFromSelector.getMonth() === dateOnRow.getMonth() && 
    dateFromSelector.getDate() === dateOnRow.getDate()
  )
  
  switch (cond) {
    case 'onOrAfter':
      return dateFromSelector < dateOnRow || equals
    case 'onOrBefore':
      return dateFromSelector > dateOnRow || equals
    default:
      return equals;
  }
})