import AppRoutes from './routes/AppRoutes'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import { ToastContainer } from 'react-toastify'

import './App.css'

function App() {


  return (

    <>
      <Header />
      <AppRoutes />
      <Footer />
      <ToastContainer autoClose={1000} />
    </>
  )
}

export default App
