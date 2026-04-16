import styles from './Header.module.css'
import { Link } from 'react-router-dom'
import  { useAuth } from './context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'


function Header() {
    const {user, inicial, logout} = useAuth();
    const [menuOpen, setMenuOpen] = useState(false); 
    const navigate = useNavigate();
    const handleLogout = () => {
    logout();
    navigate('/')

  }
    return (

        <header className={styles.headerContainer}>
            <div className={styles.logoContainer}>
                <Link to='/'>
                    <img className={styles.logo} src="./Logo.png" alt="logo ratón blanco" />
                </Link>
                <h1 className={styles.headerTitle}>Ratón blanco</h1>
            </div>




            <div className={styles.accountContainer}>


                {user ? (
                    <div className={styles.mainUserContainer}>

                        {/* {!menuOpen && <i className={`bi bi-list ${styles.hamburger}`} onClick={() => setMenuOpen(true)} />}

                        <ul className={menuOpen ? `${styles.mobileMenu} ${styles.open}` : styles.mobileMenu}>
                            <li><i className={`bi bi-x ${styles.closeBtn}`} onClick={() => setMenuOpen(false)} /></li>
                            <li>{user.role === 'admin' && (<Link to="/administracion" className={styles.link}>Admin</Link>)}</li>
                            <li>{user.role !== 'admin' && (<Link to="/Profile" className={styles.link}><span className={styles.userName}>{inicial}</span></Link>)}</li>
                            <li> <Link to="/favorites" className={styles.favorites}><i className="bi bi-heart"></i><h2 className={styles.favoritesTitle}>Favoritos</h2></Link></li>
                            <li><button onClick={handleLogout} className={styles.logout}>Cerrar sesión</button></li>
                        </ul> */}

                        <div className={styles.userLoggedContainer}>

                            {user.role === 'admin' && (<Link to="/admin" className={styles.accountLink}>Admin</Link>)}
                            {user.role !== 'admin' && (<Link to="/profile" className={styles.accountLink}><span className={styles.userName}>{inicial}</span></Link>)}
                            <Link to="/favorites" className={styles.favorites}><i className="bi bi-heart"></i><h2 className={styles.favoritesTitle}>Favoritos</h2></Link>
                            <button onClick={handleLogout} className={styles.logout}>Cerrar sesión</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <Link to='/registrationForm' className={styles.accountLink}>Crear cuenta</Link>
                        <Link to='/login' className={styles.accountLink}>Login</Link>
                    </>
                )}

            </div>

        </header>
    )
}

export default Header