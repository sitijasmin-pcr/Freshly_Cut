import { Routes, Route } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Sidebar from './components/Sidebar'
import MainLayout from './components/MainLayout'
import Customer from './Pages/Customer'
import Faq from './Pages/FAQ'
import Produk from './Pages/Produk'
import SalesManagement from './Pages/SalesManagement'
import ProdukTerlaris from './Pages/ProdukTerlaris'
import Penjualan from './Pages/Penjualan'
import BranchOutlet from './Pages/BranchOutlet'
import Feedback from './Pages/Feedback'
import ShiftManagement from './Pages/ShiftManagement'
<<<<<<< HEAD
import HomeUser from './USERPAGE/HomeUser'
import MenuUser from './USERPAGE/MenuUser'
=======
import User from './Pages/User'
import Karyawan from './Pages/Karyawan'

>>>>>>> 3caebf5166dbe8c913f95d3d33eb6bc23aa6b203

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/laporan" element={<Penjualan />} />
          <Route path="/produk" element={<Produk />} />
          <Route path="/produkTerlaris" element={<ProdukTerlaris />} />
          <Route path="/sales" element={<SalesManagement />} />
          <Route path="/branch" element={<BranchOutlet />} />
          <Route path="/shift" element={<ShiftManagement />} />
          <Route path="/feedback" element={<Feedback />} />
<<<<<<< HEAD
          <Route path="/HomeUser" element={<HomeUser />} />
          <Route path="/MenuUser" element={<MenuUser />} />
=======
          <Route path="/user" element={<User />} />
          <Route path="/karyawan" element={<Karyawan />} />
>>>>>>> 3caebf5166dbe8c913f95d3d33eb6bc23aa6b203
        </Route>
      </Routes>
    </>
  )
}

export default App
