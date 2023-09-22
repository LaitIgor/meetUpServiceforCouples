import { useContext, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import {
    Modal, 
    Box, 
    Button, 
    Backdrop,
    CircularProgress
} from '@mui/material';

import AppTemplateHOC from '../../HOCs/AppTemplateHOC';
import { ExistingProgramsContext } from '../../../Providers/ExistingProgramsProvider';
import { deleteEntity } from '../../../firebase/firebase';
import { SnackbarContext } from '../../../Providers/SnackbarProvider';

import styles from './styles.module';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 620,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '5px',
    boxShadow: 24,
    p: '16px 24px',
  };

const AdminOpenProgram = () => {
    const {existingPrograms, setExistingPrograms} = useContext(ExistingProgramsContext);
    const {setShowSnackbar} = useContext(SnackbarContext);
    const {programId} = useParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showLoader, setShowLoader] = useState(false);



    const selectedProgram = existingPrograms.programs.find(program => program.id === programId);

    function deleteProgram() {
        console.log(selectedProgram, 'Deleting program');
        setShowLoader(true)
        setShowModal(false);
        deleteEntity(selectedProgram.id, () => {
            setExistingPrograms((existingPrograms) => ({programs: existingPrograms.programs.filter(p => p.id !== selectedProgram.id)}))
            setShowLoader(false)
            navigate('/all-programs');
            setShowSnackbar({open: true});
        });

    }

    function closeModal() {
        setShowModal(false)
    }


    return (
        <>
        <div className={styles['program-container']}>
            {selectedProgram ? <h1 style={{width: '85%'}}>{selectedProgram.programName}</h1> : 
            <CircularProgress sx={{position: 'static', top: '50%', left: '50%'}} color='success' />}
            <div className={styles['program-content']}>
            {selectedProgram ? (<>
                <button className={`${styles.delete} button-clean`} onClick={() => setShowModal(true)}>Delete program</button>
                {/* <button className={`${styles.delete} button-clean`} onClick={() => setShowModal(true)}>Delete program</button> */}
                <div className={styles['content-top']}>
                    <div className={styles['content-top__block']}>
                        <h4 className={styles['block__header']}>Number of enrolls</h4>
                        <span>Number of mentees</span>
                        <span>Number of mentors</span>
                    </div>
                    <div className={styles['content-top__block']}>
                        <h4 className={styles['block__header']}>Number of matches</h4>
                        <span>Number of mentees</span>
                        <span>Number of mentors</span>
                    </div>
                    <div className={styles['content-top__block']}>
                        <h4 className={styles['block__header']}>Start Matching</h4>
                        <button>Single</button>
                        <button>Batch</button>
                    </div>
                </div>
                <div className={styles['content__activity']}>
                    <h4>Recent Activity</h4>
                    <p>Area with recent activities such as new enrolls, new matches and in the future more data points</p>
                </div></>) : 
                <CircularProgress sx={{position: 'absolute', top: '50%', left: '50%'}} color='success' />
                }
            </div>
        </div>
        <Modal
        open={showModal}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <h2 style={{marginTop: 0}} className="center">Are you sure you want to delete this program?</h2>
                <div className={styles['confirm__wrapper']}>
                    <Button variant='contained' className='button-clean' onClick={deleteProgram}>Delete</Button>
                    <Button variant='contained' className='button-clean' onClick={closeModal}>Return</Button>
                </div>
                <button onClick={closeModal} className={styles.closeBtn}>X</button>
            </Box>
        </Modal>

        <Backdrop
            open={showLoader}
            sx={{zIndex: 1301, color: '#fe9236'}}
        >
            <h3 style={{marginRight: '1rem'}}>Deleting a program...</h3>
            <br />
            <CircularProgress color="inherit" />
        </Backdrop>
        </>
    )
}

export default AppTemplateHOC(AdminOpenProgram, {backBtn: true});