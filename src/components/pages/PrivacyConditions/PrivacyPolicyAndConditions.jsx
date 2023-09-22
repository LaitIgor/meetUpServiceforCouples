import styles from './privacy.module';

export const PrivacyPolicyAndConditions = () => {
    return (
        <article className={styles['privacy__container']}>
        <h1 className={styles['privacy__header']}>Privatlivspolitik og betingelser</h1>
        <div className={styles['privacy__content']}>
            <p className={styles['privacy__subtitle']}>Ved at oprette en profil og bruge CareerMentor acceptere du følgende:</p>
            <div className={styles['privacy__terms-wrapper']}>
                <h2 className={styles['terms-wrapper__header']}>Betingelser:</h2>
                <a 
                href="https://careermentor.dk/wp-content/uploads/CareerMentor-brugsbetingelser.pdf"
                className={styles['terms-wrapper__link']}
                >Klik her for at se og læse vores betingelser
                </a>
            </div>
            <div className={styles['privacy__terms-wrapper']}>
                <h2 className={styles['terms-wrapper__header']}>Privatlivspolitik:</h2>
                <a 
                href="https://careermentor.dk/wp-content/uploads/CareerMentor-fortrolighedspolitik.pdf"
                className={styles['terms-wrapper__link']}
                >Klik her for at se og læse vores privatlivspolitik
                </a>
            </div>
            <div className={styles['privacy__terms-wrapper']}>
                <h2 className={styles['terms-wrapper__header']}>Adfærdskodeks:</h2>
                <a 
                href="https://careermentor.dk/wp-content/uploads/CareerMentor-adfaerdskodeks.pdf"
                className={styles['terms-wrapper__link']}
                >Klik her for at se og læse vores adfærdskodeks
                </a>
            </div>
        </div>
        </article>
    )
}