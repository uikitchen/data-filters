import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';

export interface IRow {
  original: {
    name: string,
    born: Date | string,
    car: string,
    city: string,
    height: number | string,
    online: boolean,
    color: {
      red: number,
      blue: number,
      green: number
    }
  }
}

export const data = (): IRow[] => Array(1000).fill(null).map(_ => ({
  name: faker.person.fullName(),
  born: faker.date.birthdate(),
  car: faker.vehicle.manufacturer(),
  city: faker.location.city(),
  height: faker.number.int({min: 150, max: 200}),
  online: faker.datatype.boolean(),
  color: {
    red: faker.number.int({min: 0, max: 255}),
    blue: faker.number.int({min: 0, max: 255}),
    green: faker.number.int({min: 0, max: 255}),
  }
})).map(e => ({original: e}))

export const getData = async () => {
  return Promise.resolve(data())
}

export const useData = () => {
  const [data, setData] = useState<IRow[]>([]);

  useEffect(() => {
    getData()
      .then((data) => {
        setData(data)
      })
  }, []);

  return data;
}