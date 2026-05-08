import { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const Admin = () => {

  const { user } = useAuth()
  const [isMobile, setIsMobile] = useState(false);

   if (!user || user.role !== 'admin') return <Navigate to="/" />

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobile) {
    return (
      <div className={styles.mobileWarning}>
        <h2>⚠️ Acceso Restringido</h2>
        <p>Esta página solo es accesible desde una computadora.</p>
        <p>Por favor, accedé desde un dispositivo de escritorio.</p>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <Link to="/productForm" className={styles.adminButon}>Cargar un producto</Link>
      <Link to="/usersTable" className={styles.adminButon}>Administrar Usuarios</Link>
      <Link to="/productsTable" className={styles.adminButon}>Administrar Productos</Link>
      <Link to="/category" className={styles.adminButon}>Administrar Categorías</Link>

    </div>
  );
};

export default Admin;