import { includes, complement, equals, startsWith, endsWith, curry, flip, lte, gte, toLower, map } from "ramda";
import { compareDate } from "../utils";

type Keys = "on" | "includes" | "onOrBefore" | "onOrAfter" | "includesCaseInsensitive" | "notContains" | "notEquals" | "startsWith" | "endsWith" | "lte" | "gte" | "eq" | "eqLoose" | "eqCaseInsensitive" | "eqMulti" | "eqMultiCaseInsensitive";

export const FilterOperations: Record<Keys, Pred> = {
  includes,
  includesCaseInsensitive: curry((input: string, value: string) => includes(toLower(input), toLower(value))),
  notContains: complement(includes) as Pred,
  notEquals: complement(equals) as Pred,
  startsWith,
  endsWith,
  on: curry(compareDate('on')),
  onOrBefore: curry(compareDate('onOrBefore')),
  onOrAfter: curry(compareDate('onOrAfter')),
  lte: flip(lte),
  gte: flip(gte),
  eq: equals,
  eqLoose: curry((input: any, value: any) => input == value),
  eqCaseInsensitive: curry((input: string, value: string) => equals(toLower(input), toLower(value))),
  eqMulti: flip(includes),
  eqMultiCaseInsensitive: curry((input: string[], value: string) => flip(includes)(map(toLower, input), toLower(value)))
}

export type Pred = ReturnType<typeof curry>;
export type FilterOperationsType = Record<keyof typeof FilterOperations, Pred>