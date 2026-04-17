
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
import './App.css'

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

        </Routes>
      </main>
      <Footer />

    </BrowserRouter>
  )
}

export default App
