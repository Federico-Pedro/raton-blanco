import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Favorites.module.css'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function Favorites() {
    const token = localStorage.getItem('token')
    const { user } = useAuth()
    if (!user) return <Navigate to="/" />
    const [favorites, setFavorites] = useState([]);
   
    const [showModal, setShowModal] = useState(false);
    const [favoriteToDelete, setFavoriteToDelete] = useState(null)

    useEffect(() => {
        const fetchFavorites = async () => {
            try {

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/favorites/user/${user.id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setFavorites(response.data)


            } catch (error) {
                console.error('Error al cargar productos', error);
            }
        };

        fetchFavorites();

    }, []);

    const handleClick = (favorite) => {
        setShowModal(true);
        setFavoriteToDelete(favorite)
        console.log(favorite)
    }

    const confirmDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/favorites/product/${favoriteToDelete}`);

            setShowModal(false)
            setFavorites(prev => prev.filter(f => f.id !== favoriteToDelete))
            setFavoriteToDelete(null)

        }
        catch (error) {
            console.error("Se produjo un error: ", error)
        }
    }

    const cancelDelete = () => {
        setShowModal(false);
        setProductToDelete(null)
    }


    if (showModal) {
        return (
            <div style={{ textAlign: 'center', padding: '200px', color: 'white' }}>
                <h2>¿Está seguro que desea eliminar de favoritos: {favoriteToDelete.name}?</h2>

                <div>
                    <button className={styles.adminButton} onClick={() => confirmDelete(favoriteToDelete.id)}>Eliminar</button>
                    <button className={styles.adminButton} onClick={() => cancelDelete()}>Cancelar</button>
                </div>
            </div>
        )
    }



    return (
        <div className={styles.body}>
            <table>
                <thead className={styles.tableHead}>
                    <tr>
                        <th className={styles.th}>ID</th>
                        <th className={styles.th}>Nombre</th>
                        <th className={styles.th}>Categoría</th>
                        <th className={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {favorites.map(f => (
                        
                            <tr key={f.id} >
                                <td className={styles.cell}>{f.id}</td>
                                <td className={styles.cell}><Link className={styles.link} to={`/product/${f.id}`}>{f.name}</Link></td>
                                <td className={styles.cell}>{f.categories.map(cat => cat.name).join(', ')}</td>
                                <td className={styles.cell}>

                                    <button className={styles.deleteButton} onClick={() => handleClick(f.id)}>Quitar de favoritos</button>
                                </td>
                            </tr>
                       
                    ))}
                </tbody>
            </table>

        </div>)

}

export default Favorites