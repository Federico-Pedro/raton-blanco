
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import RegistrationForm from './users/RegistrationForm'
import Login from './users/Login'
import Body from './Body'
import Profile from './users/Profile'
import CreateProductForm from './products/CreateProductForm'
import Admin from './users/Admin'
import Category from './products/Category'
import Favorites from './products/Favorites'
import ProductDetail from './products/ProductDetail'
import UsersTable from './users/UsersTable'
import ProductsTable from './products/ProductsTable'
import './App.css'
import { WhatsAppWidget } from 'react-whatsapp-widget'
import 'react-whatsapp-widget/dist/index.css'

function App() {


  return (
    <BrowserRouter>
      <Header />
      <main>

        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/registrationForm" element={<RegistrationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/productForm" element={<CreateProductForm />} />
          <Route path="/category" element={<Category />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/usersTable" element={<UsersTable />} />
          <Route path="/productsTable" element={<ProductsTable />} />
        </Routes>
      </main>
      <WhatsAppWidget companyName="Ratón Blanco" phoneNumber="542494216515" message="Hola! ¿En qué te puedo ayudar?" replyTimeText="" CompanyIcon={() => <img src="/Logo.png" alt="icon" style={{ width: '45px', height: '45px', objectFit: 'contain' }}  />} />
      <Footer />

    </BrowserRouter>
  )
}

export default App
