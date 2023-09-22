import { useContext } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';

import AppTemplateHOC from '../../HOCs/AppTemplateHOC';
import { ExistingProgramsContext } from '../../../Providers/ExistingProgramsProvider';

import Button from '@mui/material/Button';

import styles from './styles.module';

const UserOpenProgram = () => {
    const {existingPrograms} = useContext(ExistingProgramsContext);
    const {programId} = useParams();

    const selectedProgram = existingPrograms.programs.find(program => program.id === programId);

    return (
        <>
        {!selectedProgram && <Navigate to="/all-programs" replace={true} />}
        <div className={styles['program-container']}>
            <h1>{selectedProgram.programName}</h1>

            <div className={styles['program-content']}>
                <div className={styles['content-top']}>
                    <div className={styles['date__wrapper']}>
                        <h5 className={styles['date__header']}>Program start date</h5>
                        <input className={styles['date__value']} type="text" value={selectedProgram.programStartDate} disabled />
                    </div>
                    <div className={styles['date__wrapper']}>
                        <h5 className={styles['date__header']}>Program end date</h5>
                        <input className={styles['date__value']} type="text" value={selectedProgram.programEndDate} disabled />
                    </div>
                </div>
                <div className={styles['content__activity']}>
                    <h3 className={styles['content__header']}>Program Description</h3>
                    <p>Name of the program: <span>{selectedProgram.programName}</span></p>
                    <p>Program type: <span>{selectedProgram.programType}</span></p>
                    <p>Amount of Participants: 20</p>
                </div>

                <Link to='/prog-signup-userinfo'><Button sx={{marginTop: '16px'}} variant='contained' className={styles.signUp}>Signup</Button></Link>
            </div>
        </div>
        </>
    )
}

export default AppTemplateHOC(UserOpenProgram, {backBtn: true});