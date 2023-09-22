import {useState, useEffect, useLayoutEffect, useContext} from 'react';
import {Modal, Box, Collapse} from '@mui/material';
import { MatchDetailsContext } from '../../Providers/MatchDetailsPopupProvider';

import userIco from '../../assets/user-ico.png';

import styles from './matchmakingDetails.module';
const style = {
    maxHeight: '90vh', 
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
    overflowY: 'auto'
  };

const MatchMakingDetailsPopup = ({open, onClose}) => {
    const {showMatchedDetailsModal} = useContext(MatchDetailsContext);
    const [matchedCouple, setMatchedCouple] = useState(null);
    const [showCollapsedDetails, setShowCollapsedDetails] = useState(false);

    const  {selectedMentee, selectedMentor} = showMatchedDetailsModal;

    function showDetailsInfo() {
        setShowCollapsedDetails((prev) => !prev)
    }

    // useLayoutEffect(() => {
    //     const parsedMatchedCouple = JSON.parse(localStorage.getItem('matchedPairs'));
    //     setMatchedCouple(parsedMatchedCouple);
    // }, []);

    console.log(selectedMentor, 'selectedMentor');

    function calcMatchingProperties(propValue) {
        console.log(propValue, 'propValue received');
        if (propValue < 50) return 'low';
        if (propValue >= 50 && propValue < 75) return 'average';
        if (propValue >= 75) return 'high';
        return '';
    }

    return (
        <Modal
        open={open}
        onClose={() => onClose(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        // sx={{maxHeight: '90vh', overflowY: 'auto'}}
        >
            <Box sx={style}>
                <><h2 style={{marginTop: 0}} className="center">{`Match details for ${selectedMentee.name} and ${selectedMentor.mentor.name}`}</h2>
                <div className={styles['details__wrapper']}>

                    <div className={styles['details__top']}>
                        <div className={styles['matched-pair__profile-pic']}> 
                            <img className={styles['matched-pair__img']} src={userIco} alt="Icon" />
                            <p>{selectedMentee.name}</p>
                        </div>

                        <div className={styles.percent}>
                            <p>{selectedMentor.totalScore}%</p>
                            <p>Match</p>
                        </div>

                        <div className={styles['matched-pair__profile-pic']}> 
                            <img className={styles['matched-pair__img']} src={userIco} alt="Icon" />
                            <p>{selectedMentor.mentor.name}</p>
                        </div>
                    </div>
                    {/* Stats */}
                    <div className={styles['match-details']}>
                        <button 
                        className='center button-clean'
                        onClick={showDetailsInfo}
                        >See details</button>
                        <Collapse in={showCollapsedDetails} timeout="auto" unmountOnExit>
                            <div className={styles['match-details__wrapper']}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>&nbsp;</th>
                                            <th>Mentee</th>
                                            <th>Mentor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className={styles[calcMatchingProperties(selectedMentor.matchingStat.age)]}>
                                            <td>Age</td>
                                            <td>{selectedMentee.age}</td>
                                            <td>{selectedMentor.mentor.age}</td>
                                        </tr>
                                        <tr className={styles[calcMatchingProperties(selectedMentor.matchingStat.location)]}>
                                            <td>Location</td>
                                            <td>{selectedMentee.location}</td>
                                            <td>{selectedMentor.mentor.location}</td>
                                        </tr>
                                        <tr className={styles[calcMatchingProperties(selectedMentor.matchingStat.skills)]}>
                                            <td>Skills</td>
                                            <td>{selectedMentee.skills.join(', ')}</td>
                                            <td>{selectedMentor.mentor.skills.join(', ')}</td>
                                        </tr>
                                        <tr className={styles[calcMatchingProperties(selectedMentor.matchingStat.experience)]}>
                                            <td>Experience</td>
                                            <td>{selectedMentee.experience}</td>
                                            <td>{selectedMentor.mentor.experience}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Collapse>
                    </div>
                    <div className={styles['details__stat']}>
                        <div className={styles['stat__wrapper']}>
                            <div className={styles.progressBar}>
                                <span>Age</span>
                                <div className={styles.line}   style={{ 
                                    '--dynamic-width': `${selectedMentor.matchingStat.age}%`,
                                    '--mixed-color': `rgb(${100 - selectedMentor.matchingStat.age}, ${selectedMentor.matchingStat.age}, 0)`,
                                    }}></div>
                            </div>
                            <p>{selectedMentor.matchingStat.age || 0}%</p>
                        </div>
                        <div className={styles['stat__wrapper']}>
                            <div className={styles.progressBar}>
                                <span>Location</span>
                                <div className={styles.line}   style={{ 
                                    '--dynamic-width': `${selectedMentor.matchingStat.location}%`,
                                    '--mixed-color': `rgb(${100 - selectedMentor.matchingStat.location}, ${selectedMentor.matchingStat.location}, 0)`,
                                    }}></div>
                            </div>
                            <p>{selectedMentor.matchingStat.location || 0}%</p>
                        </div>
                        <div className={styles['stat__wrapper']}>
                            <div className={styles.progressBar}>
                                <span>Skills</span>
                                <div className={styles.line} 
                                style={{ 
                                    '--dynamic-width': `${selectedMentor.matchingStat.skills}%`,
                                    '--mixed-color': `rgb(${100 - selectedMentor.matchingStat.skills}, ${selectedMentor.matchingStat.skills}, 0)`,
                                    }}></div>
                            </div>
                            <p>{selectedMentor.matchingStat.skills || 0}%</p>
                        </div>
                        <div className={styles['stat__wrapper']}>
                            <div className={styles.progressBar}>
                                <span>Preference</span>
                                <div className={styles.line}   style={{ 
                                    '--dynamic-width': `${selectedMentor.matchingStat.experience}%`,
                                    '--mixed-color': `rgb(${100 - selectedMentor.matchingStat.experience}, ${selectedMentor.matchingStat.experience}, 0)`,
                                    }}></div>
                            </div>
                            <p >{selectedMentor.matchingStat.experience || 0}%</p>
                        </div>
                    </div>

                    <button onClick={() => onClose(false)} className='button-clean'>Approve match</button>
                </div></>
                <button onClick={() => onClose(false)} className={styles.closeBtn}>X</button>
            </Box>
        </Modal>
    )
}

export default MatchMakingDetailsPopup;