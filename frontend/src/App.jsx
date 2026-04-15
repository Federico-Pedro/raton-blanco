
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import RegistrationForm from './users/RegistrationForm'
import Login from './users/Login'
import Body from './Body'
import Profile from './users/Profile'
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

        </Routes>
      </main>
      <Footer />

    </BrowserRouter>
  )
}

export default App
