import {useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import AppTemplateHOC from '../../HOCs/AppTemplateHOC';
import Button from '@mui/material/Button';

import {ExistingProgramsContext} from '../../../Providers/ExistingProgramsProvider';

import styles from './singleMatching.module';
import userIco from '../../../assets/user-ico.png';
import backBtnIco from '../../../assets/back-btn.png';

import {mentees} from '../../../usersList';


const SingleMatching = () => {
    const {existingPrograms: {selectedForMatching}} = useContext(ExistingProgramsContext);
    const [selectValue, setSelectValue] = useState('');

    return (
        <>
        <h2 className={styles['header-text']}>Matchmaking</h2>
        <div className={styles['matchmaking']}>
            {/* <button className={styles.backBtn}><img src={backBtnIco} alt="back button" /></button> */}
            <div className={styles['matchmaking__top']}>
                <h3 style={{margin: '0 auto',}}>Program: {selectedForMatching ? selectedForMatching.programName : 'No program('}</h3>
            </div>
            <div className={styles['matchmaking__content']}>

                <h3 className={styles['content__header']}>Select mentee to begin matching</h3>
                <div className={styles['result__wrapper']} style={{maxHeight: '430px', overflowY: 'scroll'}}>
                    {mentees.map((mentee) => {
                        return  <div key={mentee.name} className={styles['result']}>
                            <Link to={`/matched-list/${mentee.id}`}><img className={styles['result__img']} src={userIco} alt="Icon" />{mentee.name}</Link>
                            {/* <Link to='/matched-list'><img className={styles['result__img']} src={userIco} alt="Icon" />{user.name}</Link> */}
                            <p className={styles['result__text']}> 
                            {`Display area for info such as: ${mentee.name}, title, competencies, language, work area & about me`}</p>
                        </div>
                    })}
                </div>

            </div>
        </div>

        </>
    )

}

export default AppTemplateHOC(SingleMatching, {backBtn: true});