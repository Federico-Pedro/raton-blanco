import styles from './Login.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [resendEmail, setResendEmail] = useState('')
    const [exceptions, setExceptions] = useState(''); //ERRORES DE VALIDACION QUE VIENEN DEL BACKEND

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, {
                email: email,
                password: password
            });
            login(response.data)
            setExceptions('')
            navigate('/')

        }
        catch (error) {

            if (error.response && error.response.status === 401) {
                setExceptions(error.response.data)

            }
        }
    }

    return (
        <div className={styles.adminContainer}>
            <p className={styles.loginMessage}>El login es obligatorio, en caso de no estar registrado clikear en "Crear cuenta"</p>
            <div className={styles.titleContainer}>
                <h2>Login</h2>
            </div>



            <form className={styles.form} onSubmit={handleSubmit} noValidate>

                <label htmlFor="email" className={styles.label}> Correo electrónico
                    <input className={styles.input} type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        id="email" />
                </label>

                <label htmlFor="password" className={styles.label}> Contraseña
                    <input className={styles.input} type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        id="password" />
                    {exceptions && <span className={styles.error}>{exceptions}</span>}
                </label>




                <button className={styles.button} type="submit">Login</button>
            </form>

           
        </div>
    )
}

export default Login