import {Link} from 'react-router-dom';
import logo from '../../assets/logo.png';

import styles from './logoLink.module'

const LogoLink = () => {
    return (
        <Link to="/" className={styles['header-logo']}>
            <img src={logo} alt="Career mentor logo" />
        </Link>
    )
}

export default LogoLink;
