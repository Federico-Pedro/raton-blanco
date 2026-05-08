import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UsersTable.module.css'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function UsersTable() {

    const { user } = useAuth()
    if (!user || user.role !== 'admin') return <Navigate to="/" />
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null)

    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data)

            } catch (error) {
                console.error('Error al cargar productos', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleClick = (user) => {
        setShowModal(true);
        setUserToDelete(user)
        console.log(user)
    }

    const confirmDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${userToDelete.email}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setShowModal(false)
            setUserToDelete(null)

            setUsers(prev => prev.filter(u => u.email !== userToDelete.email))
        }
        catch (error) {
            console.error("Se produjo un error: ", error)
        }
    }

    const cancelDelete = () => {
        setShowModal(false);
        setUserToDelete(null)
    }

    const changeRole = async (userToUpdate) => {
        try {
            const newRole = userToUpdate.role === 'admin' ? 'user' : 'admin'
            await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userToUpdate.email}`, {
                name: userToUpdate.name,
                lastName: userToUpdate.lastName,
                password: userToUpdate.password,
                role: newRole
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            })

            setUsers(users.map(u =>
                u.email === userToUpdate.email ? { ...u, role: newRole } : u
            ))
        } catch (error) {
            console.error("Se produjo un error: ", error)
        }
    }

    if (showModal) {
        return (
            <div style={{ textAlign: 'center', padding: '200px', color: 'white' }}>
                <h2>¿Está seguro que desea eliminar al usuario: {userToDelete.name}?</h2>

                <div>
                    <button className={styles.deleteButton} onClick={() => confirmDelete()}>Eliminar</button>
                    <button className={styles.deleteButton} onClick={() => cancelDelete()}>Cancelar</button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
                <img src="/public/Spinner@1x-1.0s-200px-200px.gif" alt="spinner" />
                <div className="spinner">Cargando usuarios...</div>

            </div>
        );
    }

    return (
        <div className={styles.body}>
            <table>
                <thead className={styles.tableHead}>
                    <tr>
                        <th className={styles.th}>ID</th>
                        <th className={styles.th}>Nombre</th>
                        <th className={styles.th}>Apellido</th>
                        <th className={styles.th}>Email</th>
                        <th className={styles.th}>Role</th>
                        <th className={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className={styles.cell}>{user.id}</td>
                            <td className={styles.cell}>{user.name}</td>
                            <td className={styles.cell}>{user.lastName}</td>
                            <td className={styles.cell}>{user.email}</td>
                            <td className={styles.cell}><button className={styles.deleteButton} onClick={() => changeRole(user)}>
                                {user.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                            </button></td>
                            <td className={styles.buttonCell}>

                                <button className={styles.deleteButton} onClick={() => handleClick(user)}>Eliminar</button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>)

}

export default UsersTable