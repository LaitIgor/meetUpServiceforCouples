import { useEffect, useContext, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AppTemplateHOC from "../../HOCs/AppTemplateHOC";
import Button from '@mui/material/Button';
import { ExistingProgramsContext } from '../../../Providers/ExistingProgramsProvider';
import { UserAuthContext } from '../../../Providers/AuthProvider';

import { auth } from '../../../firebase/firebase';

import styles from './allPrograms.module'

const AllPrograms = () => {
    // TODO: Add loader
    const { user } = useContext(UserAuthContext);
    const {existingPrograms, setExistingPrograms} = useContext(ExistingProgramsContext);

    const curUser =  user  !== null ? 'user' : 'admin';
    // const curUser = user === null || user.uid ? 'user' : 'admin';

    console.log(user, 'user');

    
    useEffect(() => {
    //   const curUser = auth.currentUser;
      
    //   if (curUser) {
    //     console.warn(' User exist!');
    //     console.warn(curUser.email, 'curUser ALL PROGS');
    //     setUser('user')
    //   } else {
    //     console.warn(' NO ACTIVE USER');
    //   }

    }, [])

    console.log(existingPrograms, 'existingPrograms');

    const closedPrograms = existingPrograms.programs.filter(program => program.closedProgram);
    const openPrograms = existingPrograms.programs.filter(program => !program.closedProgram);

    return (
        <>
            <div className={styles.head}>
                {curUser === 'admin' && <h1 className={styles['section-header']}>Admin panel</h1>}
                <h2 className={styles['section-subheader']}>Active programs</h2>
                {curUser === 'admin' && <Link to='/create-programs'><Button variant='outlined'>Create program</Button></Link>}
                
            </div>
            <div className={styles.content}>
                <div className={styles['program-wrapper']}>
                    <p className={styles['program-name']}>{curUser === 'admin' ? 'List of open programs' : 'Available programs'}</p>
                    <ul className={styles['program-list']}>
                        {openPrograms.length === 0 && <li className={styles['program-list__item']}>No programs here yet</li>}
                        {openPrograms.map(openProgram => {
                            return <Link 
                                    className={styles['program-list__link']}
                                    to={`/${curUser}-open-program/${openProgram.id}`} 
                                    key={openProgram.id}
                                    >
                                        <li className={`${styles['program-list__item']} ${styles.active}`}>{openProgram.programName}</li></Link>
                        })}
                    </ul>
                </div>
                <div className={styles['program-wrapper']}>
                    <p className={styles['program-name']}>{curUser === 'admin' ? 'List of closed programs' : 'You are enrolled in'}</p>
                    <ul className={styles['program-list']}>
                    {closedPrograms.length === 0 && <li className={styles['program-list__item']}>No programs here yet</li>}
                        {closedPrograms.map(closedProgram => {
                            return <Link 
                                    className={styles['program-list__link']}
                                    to={`/${curUser}-open-program/${closedProgram.id}`} 
                                    key={closedProgram.id}>
                                        <li className={`${styles['program-list__item']} ${styles.active}`}>{closedProgram.programName}</li></Link>
                        })}
                    </ul>
                </div>
           </div>
        </>
    )
}

export default AppTemplateHOC(AllPrograms);