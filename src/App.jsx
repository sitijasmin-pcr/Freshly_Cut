import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Sidebar from './components/Sidebar'
import MainLayout from './components/MainLayout'
import Customer from './Pages/Customer'
// import { Fa0 } from 'react-icons/fa6'
import Faq from './Pages/FAQ'
import Produk from './Pages/Produk'
import SalesManagement from './Pages/SalesManagement'
import ProdukTerlaris from './Pages/ProdukTerlaris'
import Penjualan from './Pages/Penjualan'
import Feedback from './Pages/Feedback'
import BranchOutlet from './Pages/BranchOutlet';
import ShiftManagement from "./Pages/ShiftManagement";





function App() {

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/faq" element={<Faq />}/>
          <Route path="/customer" element={<Customer />}/>
          <Route path="/laporan" element={<Penjualan />}/>
          <Route path="/produk" element={<Produk />}/>
          <Route path="/produkTerlaris" element={<ProdukTerlaris />}/>
          <Route path="/sales" element={<SalesManagement />}/>   
          <Route path="/branch" element={<BranchOutlet />} />
          <Route path="/shift" element={<ShiftManagement />} />
          <Route path="/feedback" element={<Feedback />}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
