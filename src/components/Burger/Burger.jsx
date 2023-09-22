import {useState, useEffect} from 'react';

import styles from './burger.module';

// const hideScroll = {overflow: 'hidden', height: '100vh'}
// const showScroll = {overflow: 'hidinitialden', height: 'initial'}

export const Burger = ({open, toggleBurger}) => {

    const burgerStyles = `${styles['burger__wrapper']} ${open ? styles.burgerOpen : ''}`

    useEffect(() => {
        const html = document.querySelector('html');
        
        if (open) {
            html.style.overflow = 'hidden';
            html.style.height = '100vh';
        } else {
            html.style.overflow = 'initial';
            html.style.height = 'initial';
        }

    }, [open])

    if (open) {
        const html = document.querySelector('html');
        html.style.overflow = 'hidden';
        html.style.height = '100vh';
    }

    return (
        <div className={burgerStyles} onClick={() => toggleBurger(!open)}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    )
}