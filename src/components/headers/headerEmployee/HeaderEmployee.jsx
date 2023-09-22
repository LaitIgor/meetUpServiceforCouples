import {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import Burger from '../../Burger';

import { UserAuthContext } from '../../../Providers/AuthProvider';

import LogoLink from '../../LogoLink/';

// import { getAuth, signOut } from 'firebase/auth';
// const auth = getAuth();

import styles from './headerEmployee.module';

const navLinks = [
    // {path: '/employees', linkText: 'Employees'},
    // {path: '/news', linkText: 'News'},
    // {path: '/programs', linkText: 'Programs'},
    // {path: '/about', linkText: 'Abouts'},
    // {path: '/contact', linkText: 'Contact us'},
    {path: '/employee-profile-fill-in', linkText: 'Employee fill in'},
]

export const HeaderEmployee = (props) => {
    const {user, setUser} = useContext(UserAuthContext);
    const [burgerOpen, setBurgerOpen] = useState(false);
    const hideNav = props.hideNav ? 'hideElem' : '';

    console.log(user, 'user');

    const curUser = user == null ? 'user' : 'admin';

    useEffect(() => {
        function checkWindowWidth() {
            console.log('Closing');
            const width = window.innerWidth;
            if (width > 1168) setBurgerOpen(false)
        }

        checkWindowWidth();
        window.addEventListener('resize', checkWindowWidth)

        return () => {
            window.removeEventListener('resize', checkWindowWidth);
            setBurgerOpen(false)
            console.warn('Header component unmounted');
        }
    }, [])

    // Change perspective from User to Admin on the app
    function switchUser() {
        const switchTo = user === null || user.uid ? {} : null;
        setUser(switchTo);
    }

    return (
        <>
        <header className={styles['header-main']}>
            <LogoLink />
            {/* {user && <div>{user.email}</div>} */}
            <div className={`${styles['header-nav__wrapper']} ${hideNav}`}>
                <nav className={`${styles['header-nav']} ${burgerOpen ? styles['mobileNav'] : ''}`}>
                    <ul className={styles['header-list']}>
                        {navLinks.map(({path, linkText}) => (
                            <li key={linkText} className={styles['header-list__item']}>
                                <Link 
                                to={path} 
                                onClick={() => setBurgerOpen(false)} 
                                className={styles['header-list__link']}>{linkText}
                                </Link>
                            </li>
                        ))}   
                    </ul>
                </nav>
                {/* Only for Dev */}
                <button className='button-clean' onClick={switchUser}>Change to {curUser} perspective</button>
                <Burger open={burgerOpen} toggleBurger={setBurgerOpen} />
                <div className={`${styles['login-btn__wrapper']} ${burgerOpen ? styles['mobileActionBtn'] : ''}`} >
                    <Link className={styles['login-btn']} to='/login'>Login</Link>
                    {/* Remove later */}
                    <Link 
                    className={`${styles['login-btn']} ${styles['login-btn--orange']}`} 
                    to='/apphome' 
                    onClick={() => setBurgerOpen(false)} 
                    >TempBtn*App*</Link>
                </div>
            </div>
        </header>
        </>
    )
}