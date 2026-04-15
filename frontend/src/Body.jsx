import styles from './Body.module.css'
import { useAuth } from './context/AuthContext'

const Body = () => {

    const {user} = useAuth();

    return (
        <div className={styles.body}>
            <div className={styles.bodyTitle}>
                {user && user.name}
            </div>
        </div>
    )
}

export default Body