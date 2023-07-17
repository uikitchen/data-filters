import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';

export interface IRow {
  name: string,
  born: Date | string,
  car: string,
  height: number | string,
  online: boolean
}

export const data = (): IRow[] => Array(1000).fill(null).map(_ => ({
  name: faker.person.fullName(),
  born: faker.date.birthdate(),
  car: faker.vehicle.manufacturer(),
  height: faker.number.int({min: 150, max: 200}),
  online: faker.datatype.boolean()
}))

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