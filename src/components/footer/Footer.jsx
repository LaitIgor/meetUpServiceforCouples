import {Link} from 'react-router-dom';

import styles from './footer.module';

export const Footer = () => {
    return (
        <footer>
            <div className={styles['footer__container']}>
                <div className={styles['footer__content']}>
                    <Link to='/privatlivspolitik-og-betingelser'>Privatlivspolitik og betingelser</Link>
                    <span>© 2023 CareerMentor.dk</span>
                </div>
            </div>
        </footer>
    )
}