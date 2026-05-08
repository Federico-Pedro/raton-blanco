import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProductsTable.module.css'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function ProductsTable() {
    const { user } = useAuth()
    if(!user || user.role !== 'admin') return <Navigate to="/" />
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null)

    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                
                setProducts(response.data)
                
            } catch (error) {
                console.error('Error al cargar productos', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        
    }, []);

    const handleClick = (product) => {
        setShowModal(true);
        setProductToDelete(product)
        console.log(product)
    }

    const confirmDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${productToDelete.id}`, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
            setShowModal(false)
            setProductToDelete(null)
            setProducts(products.filter(p => p.id !== productToDelete.id));
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
                <h2>¿Está seguro que desea eliminar el producto: {productToDelete.name}?</h2>
                <img style={{ width: '250px', heigh: 'auto', margin: '25px' }} src={productToDelete.images[0]} />
                <div>
                    <button className={styles.adminButton} onClick={() => confirmDelete()}>Eliminar</button>
                    <button className={styles.adminButton} onClick={() => cancelDelete()}>Cancelar</button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
                <img src="/public/Spinner@1x-1.0s-200px-200px.gif" alt="spinner" />
                <div className="spinner">Cargando productos...</div>

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
                        <th className={styles.th}>Categoría</th>
                        <th className={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td className={styles.cell}>{product.id}</td>
                            <td className={styles.cell}>{product.name}</td>
                            <td className={styles.cell}>{product.category}</td>
                            <td className={styles.cell}>
                                <Link to={`/form/edit/${product.id}`} className={styles.adminButon}>
                                    <button className={styles.editButton}>Editar</button>
                                </Link>
                                <button className={styles.deleteButton} onClick={() => handleClick(product)}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>)

}

export default ProductsTable