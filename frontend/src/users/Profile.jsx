import { useState } from 'react'
import styles from './Profile.module.css'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
    const { user, inicial, logout } = useAuth()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)


    const handleLogout = () => {
        logout();
        navigate('/')

    }

    const handleDelete = async (e) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${user.email}`);
            logout();
            navigate('/')
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    if (!user) return <Navigate to="/" />



    return (
        <div className={styles.profileContainer}>


            {isOpen && (
                <>
                    <div className={styles.overlay} onClick={() => setIsOpen(false)} />
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>
                            ¿Estás seguro de que deseas eliminar tu cuenta?
                        </h2>
                        <div className={styles.modalButtonContainer}>
                            <button className={styles.modalButton} onClick={handleDelete}>Eliminar</button>
                            <button className={styles.modalButton} onClick={() => setIsOpen(false)}>Cancelar</button>
                        </div>
                    </div>
                </>
            )}


            <div className={styles.avatarContainer}>
                <h1 className={styles.avatar}>{inicial}</h1>
            </div>
            <div className={styles.secondaryContainer}>
                <div>
                    <h2 className={styles.profileText}>Nombre: {user.name}</h2>
                    <h2 className={styles.profileText}>Apellido: {user.lastName}</h2>
                    <h2 className={styles.profileText}>Email: {user.email}</h2>
                </div>
                <div className={styles.buttonsContainer}>
                    <Link to="/registrationForm">
                        <button className={styles.button}>Editar información</button>
                    </Link>
                    
                    <button onClick={() => setIsOpen(true)} className={styles.button}>Eliminar usuario</button>
                    <button onClick={handleLogout} className={styles.button}>Cerrar sesión</button>
                </div>
            </div>

        </div>
    )
}

export default Profile