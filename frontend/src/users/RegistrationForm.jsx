import { useState, useEffect } from 'react'
import styles from './RegistrationForm.module.css'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'


const RegistrationForm = () => {

    const { user, login } = useAuth()
    // const [user, setUser] = useState('')
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [exceptions, setExceptions] = useState({}); //ERRORES DE VALIDACION QUE VIENEN DEL BACKEND

    const editing = user ? true : false;

    useEffect(() => {
        if (editing) {
            console.log("Editando")
            setName(user.name);
            setLastName(user.lastName);
            setEmail(user.email);
            setPassword('');
            setRepeatPassword('')
        }
    },
        [])



    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        //LA CONFIRMACION DEL PASSWORD Y DEL MAIL PUEDEN IR EN UNA FUNCION HANDLECHANGE QUE LO MUESTRE EN TIEMPO REAL

        if (password !== repeatPassword) {
            setExceptions({ password: 'Las contraseñas no coinciden' })
            return
        }


        try {

            const userData = {
                name: name,
                lastName: lastName,
                email: email,
                password: password,
                role: 'user'

            }
            console.log(userData) //para comprobar que la informacion se guarda en userData
            let response;

            if (editing) {
                response = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${user.email}`, userData);
                login(response.data)
                setSuccess(`Usuario: "${response.data.name}" actualizado exitosamente`)
            } else {
                console.log("Creando")
                response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, userData);
                setSuccess(`Usuario: "${response.data.name}" creado exitosamente!`);
                setName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setRepeatPassword('')
                setTimeout(() => navigate('/login'), 2000)
            }


        } catch (error) {
            console.log(error)
            if (error.response && error.response.status === 400) {
                setExceptions(error.response.data)

            } else {
                setError('Error al crear el usuario. Intenta de nuevo.');
            }
        }
    }




    return (
        <div className={styles.adminContainer}>
            <div className={styles.titleContainer}>
                <h2>{editing ? 'Editar usuario' : 'Registrarse'}</h2>
            </div>





            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <label htmlFor="userName" className={styles.label}> Nombre
                    <input className={styles.input} type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre del usuario"
                        id="userName" />
                    {exceptions.name && <span className={styles.error}>{exceptions.name}</span>}
                </label>

                <label htmlFor="userLastName" className={styles.label}> Apellido
                    <input className={styles.input} type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Apellido del usuario"
                        id="userLastName" />
                    {exceptions.lastName && <span className={styles.error}>{exceptions.lastName}</span>}
                </label>

                <label htmlFor="email" className={styles.label}> Correo electrónico
                    <input className={styles.input} type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        id="email"
                        disabled={editing} />
                    {exceptions.email && <span className={styles.error}>{exceptions.email}</span>}
                </label>

                <label htmlFor="password" className={styles.label}> Contraseña
                    <input className={styles.input} type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        id="password" />
                    {exceptions.password && <span className={styles.error}>{exceptions.password}</span>}
                </label>

                <label htmlFor="repeatPassword" className={styles.label}> Repetir Contraseña
                    <input className={styles.input} type="password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        placeholder="Repetir Contraseña"
                        id="repeatPassword" />
                </label>



                {success && (
                    <div className={styles.success}>{success}</div>
                )}
                {error && (
                    <div className={styles.error}>{error}</div>
                )}
                <button className={styles.button} type="submit">{editing ? 'Actualizar usuario' : 'Crear usuario'}</button>
            </form>
        </div>
    )
}

export default RegistrationForm