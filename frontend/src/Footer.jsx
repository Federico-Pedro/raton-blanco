import styles from './Footer.module.css'

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.logoContainer}>
                <img className={styles.logo} src="./Logo.png" alt="logo ratón blanco" />
                <h4 className={styles.copyright}>2026 - Ratón Blanco ©</h4>
            </div>
        </div>
    )
}

export default Footer