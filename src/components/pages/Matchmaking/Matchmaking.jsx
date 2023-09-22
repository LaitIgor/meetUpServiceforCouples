import { useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { ExistingProgramsContext } from "../../../Providers/ExistingProgramsProvider.jsx";
import AppTemplateHOC from '../../HOCs/AppTemplateHOC';

import Button from '@mui/material/Button';

import styles from './matchmaking.module.scss';

const Matchmaking = () => {
    // Array of objects with templates array
    const {existingPrograms: { programs }, setExistingPrograms} = useContext(ExistingProgramsContext);
    const [selectValue, setSelectValue] = useState('');
    const navigate = useNavigate();

    function saveSelectedProgramForMatch(e) {
        const value = e.target.value;
        setSelectValue(e.target.value);
        const selectedProgram = programs.find(p => p.programName === value);
        setExistingPrograms((programsDetails) => (
            {
                ...programsDetails, 
                selectedForMatching: selectedProgram,
            }
            ))
    }

    function navigateToMatching(type) {
        if (type === 'SINGLE') {
            navigate('single-matching')
        } else {
            navigate('batch-matching')
        }
    }

    return (
        <>
        <h2 className={styles['header-text']}>Matchmaking</h2>
        <div className={styles['matchmaking']}>
            <div className={styles['matchmaking__content']}>
                <label htmlFor="program-select">Select program</label>
                <select 
                    value={selectValue}
                    onChange={saveSelectedProgramForMatch} 
                    name="program" 
                    id="program-select"
                    disabled={programs.length === 0} 
                >
                    {programs.length === 0 && <option value={selectValue} disabled>No programs</option>}
                    <option value='' disabled>Select a program</option>
                    {programs.map(program => {
                        return <option key={program.programName} value={program.programName}>{program.programName}</option>
                    })}
                </select>
              <h4>Select Matching type</h4>
              <div className={styles.btnWrapper}>
                <div title={!selectValue ? 'Select a program first' : ''}>
                    <Button 
                        
                        className={styles.batchBtn}
                        disabled={!selectValue} 
                        variant='contained'
                        onClick={() => navigateToMatching('BATCH')}
                    >
                        Batch match
                    </Button>
                </div>
                <div title={!selectValue ? 'Select a program first' : ''}>
                    <Button 
                        className={styles.batchBtn}
                        disabled={!selectValue} 
                        variant='contained'
                        onClick={() => navigateToMatching('SINGLE')}
                    >
                        Single match
                    </Button>
                </div>
              </div>
                 
            </div>
        </div>

        </>
    )
}

export default AppTemplateHOC(Matchmaking);