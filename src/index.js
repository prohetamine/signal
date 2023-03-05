import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'

import './index.css'

import Main from './Main'
import SignalsEmulate from './SignalsEmulate'

const router = createBrowserRouter([
  {
    path: '*',
    element: <Main />
  },
  {
    path: '/signal/signalEmulate',
    element: <SignalsEmulate />
  }
]);

const root = document.getElementById("root")

navigator.mediaDevices.getUserMedia({ video: true })
    .then(() => {
      ReactDOM.createRoot(root)
        .render(
          <React.StrictMode>
            <RouterProvider router={router} />
          </React.StrictMode>
        )
    })
    .catch(e => {
      document.write('Camera not allow ⚠️<br />')
      document.write('→ Allow the site to access the camera: https://support.google.com/chrome/answer/2693767<br />')
      document.write('→ Close all tabs and applications using the camera<br />')
      document.write('→ Check if you have cameras available<br />')
      document.write('<br />')
      document.write('Message me in telegram: @prohetamine')
    })
