import styles from './ProductDetail.module.css'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom'





const ProductDetail = () => {

    const token = localStorage.getItem('token')
    const [product, setProduct] = useState(null);
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [share, setShare] = useState(false)
    const [shareMessage, setShareMessage] = useState('')
    const [copied, setCopied] = useState(false)
    const [hovered, setHovered] = useState(0)
    const { id } = useParams();
    const { user } = useAuth()
    const navigate = useNavigate()



   

   


    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
            .then(response => {
                setProduct(response.data);
                
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });

    }, [id]);

    

    const fetchData = () => {
        setError(false)
        axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
            .then(response => setProduct(response.data))
            .catch(() => setError(true))
    }

    useEffect(() => {
        fetchData()
    }, [id])


    const [favorites, setFavorites] = useState([])
    

    useEffect(() => {
        const fetchFavorites = async () => {
            try {

                //ESTE ENDPOINT TRAE LOS FAVORITOS CORRESPONDIENTES AL USUARIO LOGGEADO
                if (user) {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/favorites/user/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    //SETEA LOS ID DE LOS PRODUCTOS QUE EL USUARIO MARCÓ COMO FAVORITOS
                    setFavorites(response.data.map(p => p.id))

                    //console.log("Todos los favoritos: ", response.data)

                }
            } catch (error) {
                console.error('Error al cargar favoritos', error);
            }
        };
        fetchFavorites();

    }, []);


    const handleFavorite = async (productId) => {

        if (!favorites.includes(productId)) {

            try {
                const favoriteData = {
                    productId: productId,
                    userId: user.id
                }
                await axios.post(`${import.meta.env.VITE_API_URL}/api/favorites`, favoriteData, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                setFavorites(prev => [...prev, productId])

            } catch (error) {
                console.log(error)
            }
        } else {
            try {

                await axios.delete(`${import.meta.env.VITE_API_URL}/api/favorites/product/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setFavorites(prev => prev.filter(id => id !== productId))

            } catch (error) {
                console.log(error)
            }
        }
    }

    
    const closeModal = () => {
        setShare(false)
        setReview('')
        setCopied(false)
        setReserveModal(false)
    }

    if (!product) {
        return (<div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
            <img src="/public/Spinner@1x-1.0s-200px-200px.gif" alt="spinner" />
            <div className="spinner">Cargando producto...</div>

        </div>)
    }
    const shareText = `${product.name}\n\n${product.description}\n\n${shareMessage}`


    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>

                <div className={styles.productNameContainer}>

                    <h1>{product.name}</h1>

                    <div>

                        {
                            favorites.includes(product.id)
                                ? <i className="bi bi-heart-fill" onClick={() => handleFavorite(product.id)}></i>
                                : <i className="bi bi-heart" onClick={() => handleFavorite(product.id)}></i>
                        }


                        <i className={"bi bi-share"} onClick={() => setShare(true)}></i>

                        <i className="bi bi-chevron-left" onClick={() => navigate('/')}></i>

                    </div>
                </div>


                {/* MODAL */}
                {share && (
                    <div className={styles.overlay}>
                        <div className={styles.shareModal}>
                            <div className={styles.shareModalTitle}>
                                <h2>
                                    {product.name}
                                </h2>
                                <i className="bi bi-x" onClick={() => closeModal()}></i>
                            </div>

                            <img src={`${product.images[0]}`} alt="" className={styles.modalImage} />


                            <p>
                                {product.description}
                            </p>

                            <a href={`http://localhost:5173/product/${product.id}`} target="_blank" className={styles.productLink}>
                                {`http://localhost:5173/product/${product.id}`}
                            </a>

                            <textarea name="" id="" placeholder="Ingresa un comentario"
                                onChange={(e) => setShareMessage(e.target.value)}
                                value={shareMessage}
                            >

                            </textarea>
                            <div className={styles.shareModalTitle}>
                                <h3>
                                    Elige una red social para compartir: "{product.name}"
                                </h3>
                                {copied && <p>Contenido copiado, podés pegarlo en Instagram</p>}

                            </div>
                            <div className={styles.iconContainter}>
                                <i
                                    className="bi bi-instagram"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${shareText}\n\nhttp://localhost:5173/product/${product.id}`)
                                        window.open('https://www.instagram.com')
                                        setCopied(true)
                                    }}
                                />
                                <i className="bi bi-facebook"
                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`http://localhost:5173/product/${product.id}`)}&quote=${encodeURIComponent(shareText)}`)} />
                                <i
                                    className="bi bi-twitter"
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(`http://localhost:5173/product/${product.id}`)}`)}
                                />
                            </div>
                        </div>
                    </div>
                )

                }

            </div>


            {/* IMAGENES DEL PRODUCTO */}
            <div className={styles.imageContainer}>
                {product.images && product.images.length > 0 && product.images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className={index === 0 ? styles.mainImage : styles.smallImage}
                    />
                ))
                }
            </div>
            
            {/* DESCRIPCION DEL PRODUCTO */}
            <div className={styles.productDescription}>

                <p>{product.description}</p>
            </div>


        </div>
    );
};

export default ProductDetail;