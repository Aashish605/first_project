import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Add from './components/Add.jsx'
import All from './components/All.jsx'
import FindOne from './components/FindOne.jsx'


const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>
    <Route path='add-student' element={<Add />} />
    <Route path='students' element={<All />} />
    <Route path='search' element={<FindOne />} />

  </Route>
))


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
