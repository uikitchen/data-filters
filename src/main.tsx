import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { columnDefinitions } from './columns.ts'
import { data } from './data.ts'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App columnDefinitions={columnDefinitions} data={data}/>
  </React.StrictMode>,
)
