import React from 'react';

import styles from './homepage.module'

export const Homepage = () => {
    return (
        <>
            <section className={styles['hero']}>
                {/* <div className={styles['hero-content']}> */}
                    <h1 className={styles['hero__header']}>Take your career to next level with a mentor</h1>
                    <p className={styles['hero__subtext']}>CareerMentor er en gratis online selvbetjeningsplatform til at koble mentorer og mentees sammen.</p>
                    <ul>
                        <li>Best practise</li>
                        <li>Best practise</li>
                        <li>Best practise</li>
                    </ul>
                    {/* <div className={styles['hero-content__slogan']}>Title slogan</div>
                    <div className={styles['hero-content__benefits']}> Benefits <br/> 1. <br/>2.<br/> 3.</div>
                    <div className={styles['hero-content__about']}>About (short presentation)</div>
                    <button className={styles['hero-content__cta']}>Call to action</button> */}
                {/* </div> */}
            </section>
        </>
    )
}