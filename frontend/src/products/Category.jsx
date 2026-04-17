import styles from './Category.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Category = () => {

    const { user } = useAuth()
    if (!user || user.role !== 'admin') return <Navigate to="/" />
    const token = localStorage.getItem('token')



    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState('')
    const [categoryName, setCategoryName] = useState('')
    const [categoryToDelete, setCategoryToDelete] = useState(null)
    const [description, setDescription] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')

    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false);

    const [id, setId] = useState(undefined)


    const editing = id !== undefined;
    useEffect(() => {
        if (editing) {
            axios.get(`${import.meta.env.VITE_API_URL}/api/categories/${id}`)
                .then(response => {
                    const category = response.data;
                    setCategory(category)
                    setCategoryName(category.name || '');
                    setDescription(category.description || '');

                    setSelectedCategory(category || [])

                })
                .catch(error => {
                    console.error('Error fetching product:', error);
                });
        }
    }, [id]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
                setCategories(response.data)

            } catch (error) {
                console.error('Error al cargar características', error);
            }
        };

        fetchCategories();
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();


        //VALIDACIONES EN EL FRONT
        if (!categoryName.trim()) {
            setError('El nombre es obligatorio');
            return;
        }
        if (!description.trim()) {
            setError('La descripción es obligatoria');
            return;
        }


        try {

            const categoryData = {
                name: categoryName,
                description: description

            }

            if (editing) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, categoryData);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
                setCategories(response.data)


            } else {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, categoryData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCategories(prev => [...prev, response.data])

                setCategoryName('');
                setDescription('');

            }


        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError('Error al guardar la categoria. Intenta de nuevo.');
            }
        }
    }


    const handleDelete = (category) => {
        setShowModal(true);
        setCategoryToDelete(category)
    }

    const handleEdit = (category) => {
        setId(category.id)
    }

    const cancelDelete = () => {
        setShowModal(false);
        setCategoryToDelete(null)
    }

    const confirmDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/${categoryToDelete.id}`);
            setShowModal(false)

            setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id))
            setCategoryToDelete(null)
        }
        catch (error) {
            console.error("Se produjo un error: ", error)
        }
    }

    if (showModal) {
        return (
            <div style={{ textAlign: 'center', padding: '200px', color: 'white' }}>
                <h2>¿Está seguro que desea eliminar esta categoría: {categoryToDelete.name}?</h2>
                <p>Todos los productos asociados a ella podrían ser eliminados</p>
                <div>
                    <button className={styles.deleteButton} onClick={() => confirmDelete()}>Eliminar</button>
                    <button className={styles.deleteButton} onClick={() => cancelDelete()}>Cancelar</button>
                </div>
            </div>
        )
    }

    return (

        <div className={styles.body}>
            <h2 className={styles.title}>
                Categorías
            </h2>
            <table>
                <thead className={styles.tableHead}>
                    <tr>
                        <th className={styles.th}>ID</th>
                        <th className={styles.th}>Nombre</th>
                        <th className={styles.th}>Descripcion</th>
                        <th className={styles.th}>Accciones</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {categories.map(cat => (
                        <tr key={cat.id}>
                            <td className={styles.cell}>{cat.id}</td>
                            <td className={styles.cell}>{cat.name}</td>
                            <td className={styles.cell}>{cat.description}</td>

                            <td className={styles.buttonCell}>
                                <button className={styles.deleteButton} onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleEdit(cat)

                                }}>Editar</button>
                                <button className={styles.deleteButton} onClick={() => handleDelete(cat)}>Eliminar</button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>



            <div className={styles.addCategoryContainer}>

                <form className={styles.form} onSubmit={handleSubmit}>

                    <div className={styles.inputContainer}>

                        <label htmlFor="categoryName"> Categoria
                            <input type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Nombre de la categoría"
                                id="categoryName"
                                className={styles.inputMargin} />
                        </label>

                        <label htmlFor="description"> Descripción
                            <textarea
                                value={description}
                                rows="4"
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Descripción"
                                id="description"
                                className={styles.inputMargin}></textarea>
                        </label>

                    </div>

                    <button className={styles.button} type="submit">{editing ? 'Actualizar categoría' : 'Agregar categorìa'}</button>
                </form>
            </div>
        </div>
    )
}

export default Category