import styles from './Body.module.css'
import { useAuth } from './context/AuthContext'
import { useState, useEffect } from 'react'
import  ProductList  from './products/ProductList'
import axios from 'axios';

const Body = () => {

    const {user} = useAuth();
    const [products, setProducts] = useState([])
    const [searchText, setSearchText] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [filteredResults, setFiltedredResults] = useState('')

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
                setProducts(response.data)
                console.log(response.data)
            } catch (error) {
                console.error('Error al cargar productos', error);
            }

        }
        fetchProducts();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        await setFiltedredResults(searchText)
        setSuggestions([])
    }

    const clearSearch = async (e) => {
        e.preventDefault()
        await setFiltedredResults('')
        setSuggestions([])
        setSearchText('')
    }


    return (
        <main className={styles.mainContainer}>

            <div className={styles.searchContainer}>
                Buscador
                <form onSubmit={handleSubmit}>
                    <div>

                        <label htmlFor="search">
                            <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder="Ingrese su busqueda"
                                autoComplete="off"
                                className={styles.search}
                                value={searchText}
                                onChange={(e) => {
                                    const value = e.target.value
                                    setSearchText(value)
                                    if (value.length > 0) {
                                        setSuggestions(products.filter(p =>
                                            p.description.toLowerCase().includes(value.toLowerCase())
                                        ))

                                    } else {
                                        setSuggestions([])
                                        setFiltedredResults('')
                                    }
                                }}
                            />
                        </label>

                        
                    </div>
                    <div>

                        <button className={styles.searchButton} type="submit">Buscar</button>
                        <button className={styles.searchButton} type="button" onClick={clearSearch}>Limpiar búsqueda</button>
                    </div>
                </form>
                <p>Ingrese una palabra clave filtrar resultados</p>

                {suggestions.length > 0 &&

                    <div className={styles.sugerencias}>Sugerencias: {
                        suggestions.map(s => (<p key={s.id}
                            onClick={() => {
                                setSearchText(s.name)
                                setSuggestions([])
                            }
                            }
                        >{s.name}</p>))
                    } </div>
                }
            </div>

            <div className={styles.container}>
                <div className={styles.productsContainer}>

                    <div className={styles.titleContainer}><h2>Productos</h2></div>


                    <ProductList filteredResults={filteredResults} />

                </div>

            </div>
            

            

        </main>
    )
}

export default Body