import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    })

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', userData.token)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setUser(null)
        
    }

    const inicial = user ? Array.from(user.name)[0] + Array.from(user.lastName)[0] : '';

    return (
        <AuthContext.Provider value={{ user, login, logout, inicial }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)