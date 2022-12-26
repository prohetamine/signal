import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'

import './index.css'

import Main from './Main'
import SignalsEmulate from './SignalsEmulate'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />
  },
  {
    path: '/signalEmulate',
    element: <SignalsEmulate />
  }
]);

const root = document.getElementById("root")

ReactDOM.createRoot(root)
  .render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
