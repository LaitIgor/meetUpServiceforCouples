import {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import AppTemplateHOC from "../../HOCs/AppTemplateHOC";
import { ExistingProgramsContext } from '../../../Providers/ExistingProgramsProvider.jsx';
import { Button, Backdrop, CircularProgress } from '@mui/material';

import { addEntity } from '../../../firebase/firebase';

import styles from './createProgram.module';


export const defaultProgramValues = {
    programName: '',
    programType: '',
    threshold: 75,
    programStartDate: '',
    programEndDate: '',
    closedProgram: false,
    reverseRolesBox: false,
    shouldMatchAllMentees: true,
}

const minDate = new Date().toISOString().split('T')[0];

const CreatePrograms = () => {
    const {existingPrograms, setExistingPrograms} = useContext(ExistingProgramsContext);
    const [fieldValues, setFieldValues] = useState(defaultProgramValues);
    const [showLoader, setShowLoader] = useState(false);
    const navigate = useNavigate();

    let endDateMin = new Date().toISOString().split('T')[0];
    if (fieldValues.programStartDate !== '') {
        const endDateInitial = new Date(fieldValues.programStartDate);
        const modifiedEndDate = new Date(endDateInitial.setDate(endDateInitial.getDate() + 1));
        endDateMin = modifiedEndDate.toISOString().split('T')[0];
    }

    useEffect(() => {
        if (fieldValues.programStartDate) {
            setFieldValues({...fieldValues, programEndDate: ''})
        }
    }, [fieldValues.programStartDate])
    

    function inputChangeHandler(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        setFieldValues({...fieldValues, [name]: value})
    }

    function submitForm(e) {
        setShowLoader(true);
        e.preventDefault();
        const id = crypto.randomUUID();
        setFieldValues(defaultProgramValues);
        const sortedPrograms = [...existingPrograms.programs, {...fieldValues, id}].sort((program1, program2) => {
            return program1.programName.toLowerCase() > program2.programName.toLowerCase();
          });
        setExistingPrograms({programs: sortedPrograms, newlyAddedProgram: fieldValues.programName})

        // TODO: handle error
        setTimeout(() => {
            addEntity({...fieldValues, id}, 'PROGRAMS')
            setShowLoader(false);
            navigate("/invite-participants");
        }, 1000)
    }

    return (
        <>  
        <h1 className={styles.header}>Program Creation</h1>
        <div className={styles['program-create__wrapper']}>
            <form onSubmit={submitForm} className={styles['program-create__form']}>
                <div className={styles['textInput__wrapper']}>
                    <label>Program Name
                        <input value={fieldValues.programName} onChange={inputChangeHandler} required type="text" name="programName" id="programName" placeholder='Program Name' />
                    </label>
                    <label>Program Type
                        <input value={fieldValues.programType} onChange={inputChangeHandler} required type="text" name="programType" id="programType" placeholder='Program Type' />
                    </label>
                    <label className={styles.periodDate}>Program start date
                        <input 
                            required 
                            min={minDate} 
                            value={fieldValues.programStartDate} 
                            onChange={inputChangeHandler} 
                            type="date" 
                            name="programStartDate" 
                            id="programStartDate" 
                            placeholder='Program End Date' 
                        />
                    </label>
                    <label className={`${styles.periodDate} ${!fieldValues.programStartDate ? styles.disabled : ''}`}>Program end date
                        <input 
                            disabled={!fieldValues.programStartDate}
                            title={!fieldValues.programStartDate ? 'Choose Start date first' : ''}
                            required 
                            min={endDateMin} 
                            value={fieldValues.programEndDate} 
                            onChange={inputChangeHandler} 
                            type="date" 
                            name="programEndDate" 
                            id="programEndDate" 
                            placeholder='Program End Date' 
                        />
                    </label>
                </div>
                <div className={styles['checkbox__container']}>
                    <div title='Closed programs are invite only programs' className={styles['checkbox__wrapper']}>
                        <input checked={fieldValues.closedProgram} onChange={inputChangeHandler} type="checkbox" name="closedProgram" id="closedProgram" />
                        <label htmlFor='closedProgram'>Closed Program</label>
                    </div>
                    <div className={`${styles['checkbox__wrapper']} ${styles['checkbox__wrapper-threshold']}`}>
                        <input value={fieldValues.threshold} onChange={inputChangeHandler} required type="number" pattern="^(100|[0-9]|[1-9][0-9])$" inputMode="numeric" min='0' max='100' name="threshold" id="threshold" />
                        <label htmlFor='threshold'>% Threshold for matching</label>
                    </div>
                    <div title='Reverse the roles to pair mentees as mentors and vice versa' className={styles['checkbox__wrapper']}>
                        <input checked={fieldValues.reverseRolesBox} onChange={inputChangeHandler} type="checkbox" name="reverseRolesBox" id="reverseRoles" />
                        <label htmlFor='reverseRoles'>Reverse roles</label>
                    </div>
                    <div className={styles['checkbox__wrapper']}>
                        <input checked={fieldValues.shouldMatchAllMentees} onChange={inputChangeHandler} type="checkbox" name="shouldMatchAllMentees" id="shouldMatchAllMentees" />
                        <label htmlFor='shouldMatchAllMentees'>Must match every mentee (overrides threshold)</label>
                    </div>

                </div>
            <Button variant="contained" type="submit">Create</Button>
            </form>
        </div>

        <Backdrop
            open={showLoader}
            sx={{zIndex: 11, color: '#fe9236'}}
        >
            <h3 style={{marginRight: '1rem'}}>Creating program...</h3>
            <br />
            <CircularProgress color="inherit" />
        </Backdrop>
        </>
    )
}

export default AppTemplateHOC(CreatePrograms)