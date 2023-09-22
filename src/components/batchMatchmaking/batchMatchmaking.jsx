import {
    useContext, 
    useState, 
    useEffect, 
    useRef
} from 'react';
import {Navigate} from 'react-router-dom';
import {Box, Collapse, Button, Alert, Snackbar, Autocomplete, TextField} from '@mui/material';

import userIco from '../../assets/user-ico.png';

import {MatchDetailsContext} from '../../Providers/MatchDetailsPopupProvider';
import { ExistingProgramsContext } from '../../Providers/ExistingProgramsProvider';

import {menteesBatch as mentees1, mentorsBatch as mentors1} from '../../usersList';


import styles from './batchMatchmaking.module';
import checked from '../../assets/checked.png';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '5px',
    boxShadow: 24,
    p: 2,
  };

  const pairs = [
   {
    id: 1,
    mentorName: 'Mentor 1',
    menteeName: 'Mentee 1',
    match: '99',
    suggestedMatches: [
        {
            mentorName: 'MentorS 1',
            match: '98'
        },
        {
            mentorName: 'MentorS 2',
            match: '97'
        },
    ]
  },
  {
     id: 2,
    mentorName: 'Mentor 2',
    menteeName: 'Mentee 2',
    match: '97',
    suggestedMatches: [
        {
            mentorName: 'MentorS 3',
            match: '95'
        },
        {
            mentorName: 'MentorS 4',
            match: '93'
        },
    ]
  },
  {
    id: 3,
    mentorName: 'Mentor 3',
    menteeName: 'Mentee 4',
    match: '96',
    suggestedMatches: [
        {
            mentorName: 'MentorS 4',
            match: '94'
        },
        {
            mentorName: 'MentorS 5',
            match: '91'
        },
    ]
  },
]
// this value estimates the lowest point for which match considered successful
const MATCH_THRESHOLD = 70;

function customSort(a, b) {
    if (a.matchesAmount === 0 && b.matchesAmount === 1) {
        return 1; // Place 'a' after 'b'
    } else if (a.matchesAmount === 1 && b.matchesAmount === 0) {
        return -1; // Place 'a' before 'b'
    } else {
        return a.matchesAmount - b.matchesAmount; // Normal ascending sorting
    }
}

const BatchMatchmaking = ({onClose, selectedProgram}) => {
    // TODO: in Strict mode batching does not work
    const {setShowModal} = useContext(MatchDetailsContext);
    const { existingPrograms: {selectedForMatching} } = useContext(ExistingProgramsContext);

    const [calculatedMatchesToRender, setCalculatedMatchesToRender] = useState([])
    const [filteredSuggestionsMatches, setFilteredSuggestionsMatches] = useState([]);
    const [belowThresholdMatches, setBelowThresholdMatches] = useState([]);

    const [showReassignAllert, setShowReassignAlert] = useState(null);
    const [approvedMatches, setApprovedMatches] = useState([]);
    const [showCollapsed, setShowCollapsed] = useState({});
    const [averageMatch, setAverageMatch] = useState(0);
    const [autoSelectNewMentor, setAutoselectNewMentor] = useState({});

    const listOfAssignedMentors = useRef([])
    // For filtering out mentors in suggested list which already have been approved
    const listOfApprovedMentors = useRef([]);

    if (!selectedForMatching) {
        return <Navigate to='/matchmaking' replace/>
    }

    const allApproved = calculatedMatchesToRender.length === 0 && approvedMatches.length > 0;

    const finalPairsList = [];
    let initialMenteesIteration;

    const threshold = selectedForMatching.threshold;



    useEffect(() => {
        const t0 = performance.now();
        createMenteeMentorsList();
        const t1 = performance.now();
        console.log(finalPairsList, 'finalPairsList AFTER function finished', t1 - t0, 'time spent');
        console.log(t1 - t0, 'time spent');
    }, [])


    // this is to create arrays to render matches who meet threshold and those who dont
    useEffect(() => {
        let filteredSuggestionsMatches = [];
        let belowThresholdMatches = [];
    
        if (!selectedForMatching.shouldMatchAllMentees) {
            console.warn(calculatedMatchesToRender, 'calculatedMatchesToRender111');
            calculatedMatchesToRender.forEach(match => {
                if (match.assignedMentor.totalScore >= threshold) {
                    const matchWithFileredAlts = {
                        ...match,
                        alternativeMatches: match.alternativeMatches.filter(altMatch => altMatch.totalScore >= threshold)}
                    filteredSuggestionsMatches.push(match)
                    // filteredSuggestionsMatches.push(matchWithFileredAlts)
                } else {
                    belowThresholdMatches.push(match)
                }
            })

            setFilteredSuggestionsMatches(filteredSuggestionsMatches);
            setBelowThresholdMatches(belowThresholdMatches);


    
            // filteredSuggestionsMatches = filteredSuggestionsMatches.filter(match => match.assignedMentor.totalScore >= threshold)
        } else {
        // Filter out approved mentors for suggestions
            filteredSuggestionsMatches = calculatedMatchesToRender.map(pair => {return {...pair, alternativeMatches: pair.alternativeMatches.filter((altMatch) => 
            !listOfApprovedMentors.current.includes(altMatch.mentor.id))}});
            setFilteredSuggestionsMatches(filteredSuggestionsMatches);
        }
    }, [calculatedMatchesToRender])

    // Working area ---------------------------------------------------------------------
    // Working area ---------------------------------------------------------------------
    // Working area ---------------------------------------------------------------------

    let menteesBatch = mentees1.filter((mentee) => !approvedMatches.some((elem) => elem.mentee.id === mentee.id));
    let mentorsBatch = mentors1.filter((mentor) => !approvedMatches.some((elem) => elem.assignedMentor.mentor.id === mentor.id));

    function singleMatchmaking(mentee) {
        const menteeSkills = mentee.skills;
        const menteeExperience = mentee.experience;
        const menteeAge = mentee.age;
        const menteeLocation = mentee.location;

        let singleMentorMatchId = null;
        let matchesAmount = 0; 
        let matchesList = [];

        mentorsBatch.forEach((mentor, i) => {
            const currentMentor = {mentor, totalScore: 0, matchingStat: {}}

            const mentorSkills = mentor.skills;
            const mentorExperience = mentor.experience;
            const mentorAge = mentor.age;
            const mentorLocation = mentor.location;

            // Skills compatibility estimation
            if (mentorSkills.length >= menteeSkills.length) {
                const skillsMatched = menteeSkills.every((skill) => mentorSkills.includes(skill))
                if (skillsMatched) {
                    currentMentor.matchingStat.skills = 100;
                    currentMentor.totalScore += 50;
                } else {
                    currentMentor.matchingStat.skills = 0;
                }
            }

            // Experience compatibility estimation
            const experienceDifference = mentorExperience - menteeExperience;
            if (experienceDifference >= 5) {
                currentMentor.matchingStat.experience = 100;
                currentMentor.totalScore += 30;
            } else if (experienceDifference >= 1 && experienceDifference <= 4) {
                currentMentor.matchingStat.experience = 50;
                currentMentor.totalScore += 15;
            } else {
                currentMentor.matchingStat.experience = 0;
            }

            // Age compatibility estimation
            const ageDifference = mentorAge - menteeAge;
            if (ageDifference >= 5) {
                currentMentor.matchingStat.age = 100;
                currentMentor.totalScore += 10;
            } else if (ageDifference >=3 && ageDifference < 5) {
                currentMentor.matchingStat.age = 50;
                currentMentor.totalScore += 5;
            } else {
                currentMentor.matchingStat.age = 0;
            }

            // Location compatibility estimation
            if (mentorLocation === menteeLocation) { 
                currentMentor.matchingStat.location = 100;
                currentMentor.totalScore += 10;
            } else {
                currentMentor.matchingStat.location = 0;
            }

            // Increment matches amount that satisfy threshold value
            if (currentMentor.totalScore >= MATCH_THRESHOLD) {
                matchesAmount += 1
                // ALways add mentor id incase if at the end we are left with
                // only one match, so we know id of that mentor
                singleMentorMatchId = currentMentor.mentor.id;
            }

            matchesList.push(currentMentor);
        })

        matchesList.sort((match1, match2) => match2.totalScore - match1.totalScore);
        return {matchesList, matchesAmount, singleMentorMatchId};
    }

    function createMenteeMentorsList(reassignMentor = null) {
        const listOfSingleMatchedMentorsIds = [];

        let firstMenteeIteration = [];
        let singleMatchPairsAmount = 0;


        for(let mentee of menteesBatch) {
            const {matchesList, matchesAmount, singleMentorMatchId} = singleMatchmaking(mentee, mentorsBatch);
            singleMatchPairsAmount += matchesAmount === 1 ? 1 : 0;
    
            if (matchesAmount === 1) {
                const existingMentorIdIndex = listOfSingleMatchedMentorsIds.findIndex((elem) => elem.mentorId === singleMentorMatchId);
                if (existingMentorIdIndex !== -1) {
                    listOfSingleMatchedMentorsIds[existingMentorIdIndex].menteesIds.push(mentee.id)
                } else {
                    listOfSingleMatchedMentorsIds.push({mentorId: singleMentorMatchId, menteesIds: [mentee.id]})
                }
            }
    
            const allResultsForOneMentee = {
                mentee, 
                mentorsResult: matchesList,
                matchesAmount
            }

    
            firstMenteeIteration.push(allResultsForOneMentee)
        }
        
        // firstMenteeIteration.sort(sortASC)   
        firstMenteeIteration.sort(customSort)                // [1, 1, 1, 0, 2, 3, 4] this one best so far
        // firstMenteeIteration.sort(customSortASCZeroEnd)       // [1, 1, 1, 2, 3, 4, 0]
        // firstMenteeIteration.sort(customSortDESC)            // [3, 2, 2, 0, 1, 1, 1]
        // firstMenteeIteration.sort(sortDESC)                  // [3, 3, 2, 2, 1, 1, 0]
        // firstMenteeIteration.sort(() => Math.random() - 0.5)                  // [RANDOM ORDER]


        if (!initialMenteesIteration) initialMenteesIteration = [...firstMenteeIteration];

        // Reassignment part
        if (reassignMentor) {
            const {curPair, newMentor} = reassignMentor;

            const menteeId = curPair.mentee.id;
            const mentorId = newMentor.mentor.id;
            const reassignedMentorMenteePair = {
                id: curPair.id,
                mentee: curPair.mentee,
                assignedMentor: newMentor,
                alternativeMatches: findAlternatives(menteeId, mentorId),
            }
            listOfAssignedMentors.current.push(mentorId)
    
            approveMatch(reassignedMentorMenteePair)
            // finalPairsList.push(reassignedMentorMenteePair);

            menteesBatch = menteesBatch.filter((mentee) => mentee.id !== menteeId)
            mentorsBatch = mentorsBatch.filter((mentor) => mentor.id !== mentorId)
            firstMenteeIteration = firstMenteeIteration.filter((iteration) => iteration.mentee.id !== menteeId)

            // TODO: make separate function
            const currValue = typeof showCollapsed[menteeId] !== undefined ? !showCollapsed[menteeId] : true
            setShowCollapsed({...showCollapsed, [menteeId]: currValue });

            setShowReassignAlert({menteeName: curPair.mentee.name, mentorName: newMentor.mentor.name})
        }

        // Check if there are mentees who share the same mentor
        const arrayOfIntersectingMatches = listOfSingleMatchedMentorsIds.filter((elem) => elem.menteesIds.length > 1);
        if (arrayOfIntersectingMatches.length > 0) {
            console.warn(arrayOfIntersectingMatches, 'There are intersections');

            // Look for intersecting menteeIds and start comparison whith their next best suggestion and assignment
            arrayOfIntersectingMatches.forEach((intersectingMentorObj) => {
                console.log(intersectingMentorObj, 'intersectingMentorObj');
                const winnerForAssignment = {};
                intersectingMentorObj.menteesIds.forEach((singleMenteeId) => {
                    const foundMentee = firstMenteeIteration.find((mentee) => mentee.mentee.id === singleMenteeId)
                    
                    // Make sure mentee has atleast one more match. If not, ignore him
                    if (foundMentee.mentorsResult[0] && foundMentee.mentorsResult[1]) {
                        // Estimate score difference between next best match
                        const nextBestDifference = foundMentee.mentorsResult[0].totalScore - foundMentee.mentorsResult[1].totalScore;

                        if (winnerForAssignment.scoreDifference || winnerForAssignment.scoreDifference === 0) {
                            if (nextBestDifference < winnerForAssignment.scoreDifference) {
                                winnerForAssignment.menteeId = singleMenteeId;
                                winnerForAssignment.mentorId = intersectingMentorObj.mentorId;
                                winnerForAssignment.scoreDifference = nextBestDifference;
                                //if difference is equal or bigger, leave previos mentee
                            }
                        } else {
                            winnerForAssignment.menteeId = singleMenteeId;
                            winnerForAssignment.mentorId = intersectingMentorObj.mentorId;
                            winnerForAssignment.scoreDifference = nextBestDifference;
                        }
                    }
                    

                })

                // TODO: separate function for this and below
                const mentee = firstMenteeIteration.find((mentee) => mentee.mentee.id === winnerForAssignment.menteeId);
                const mentorId = mentee.mentorsResult[0].mentor.id;
                const resMentorMenteePar = {
                    id: crypto.randomUUID(),
                    mentee: mentee.mentee,
                    assignedMentor: mentee.mentorsResult[0],
                    alternativeMatches: findAlternatives(mentee.mentee.id, mentorId),
                }
                listOfAssignedMentors.current.push(mentorId)
                finalPairsList.push(resMentorMenteePar);

                menteesBatch = menteesBatch.filter((mentee) => mentee.id !== winnerForAssignment.menteeId)
                mentorsBatch = mentorsBatch.filter((mentor) => mentor.id !== winnerForAssignment.mentorId)

            })
            return createMenteeMentorsList(); 
        }

        // This function find alternative mentors and filters out one who is assigned to current mentee and approved ones
        function findAlternatives(menteeId, mentorId) {
            const findCurMentee = initialMenteesIteration.find((menteeObj) => menteeObj.mentee.id === menteeId )
            const suggestedResultsWhithoutAssigned = findCurMentee.mentorsResult.filter((elem) => elem.mentor.id !== mentorId &&
            !listOfApprovedMentors.current.includes(elem.mentor.id))
            return suggestedResultsWhithoutAssigned
            // return suggestedResultsWhithoutAssigned.slice(0, 3)
        }

        // Assignment part
        // TODO: separate function for this and above
        const menteeId = firstMenteeIteration[0].mentee.id;
        const mentorId = firstMenteeIteration[0].mentorsResult[0].mentor.id;
        const finalMentorMenteePair = {
            id: crypto.randomUUID(),
            mentee: firstMenteeIteration[0].mentee,
            assignedMentor: firstMenteeIteration[0].mentorsResult[0],
            alternativeMatches: findAlternatives(menteeId, mentorId),
        }
        listOfAssignedMentors.current.push(mentorId)
        finalPairsList.push(finalMentorMenteePair);

        menteesBatch = menteesBatch.filter((mentee) => mentee.id !== firstMenteeIteration[0].mentee.id)
        mentorsBatch = mentorsBatch.filter((mentor) => mentor.id !== firstMenteeIteration[0].mentorsResult[0].mentor.id)

        // Recurse until no mentees left without pair
        if (menteesBatch.length > 0) {
            createMenteeMentorsList();
        } else {
            finalPairsList.sort((pair1, pair2) => pair2.assignedMentor.totalScore - pair1.assignedMentor.totalScore)
            setCalculatedMatchesToRender(finalPairsList);


            const bestMatchesArr = [];
            [...approvedMatches, ...finalPairsList].forEach((elem) => bestMatchesArr.push(elem.assignedMentor.totalScore))
            
            const sum = bestMatchesArr.reduce((iterator, nextElem) => {
                return iterator + nextElem
            }, 0)

            setAverageMatch(sum / bestMatchesArr.length);
        }
    }
    // Working area---------------------------------------------------------------------
    // Working area---------------------------------------------------------------------
    // Working area---------------------------------------------------------------------

    // console.log(calculatedMatchesToRender, 'calculatedMatchesToRender');
    // console.log(selectedForMatching, 'selectedForMatching');
    // console.log(filteredSuggestionsMatches, 'filteredSuggestionsMatches');
    // console.log(belowThresholdMatches, 'belowThresholdMatches');

    function approveMatch(newApprovedPair, approveBelowThreshold = false) {
        listOfApprovedMentors.current = [...listOfApprovedMentors.current, newApprovedPair.assignedMentor.mentor.id];
        if (approveBelowThreshold) {
            const newBelowThreshold = belowThresholdMatches.filter((suggestion) => suggestion.mentee.id !== newApprovedPair.mentee.id);
            setApprovedMatches((prevApproved) => [...prevApproved, newApprovedPair])
            setBelowThresholdMatches(newBelowThreshold);

        } else {
            const filteredSuggestions = filteredSuggestionsMatches.filter((suggestion) => suggestion.mentee.id !== newApprovedPair.mentee.id);
            setApprovedMatches((prevApproved) => [...prevApproved, newApprovedPair])
            setFilteredSuggestionsMatches(filteredSuggestions);
            // setCalculatedMatchesToRender(filteredSuggestions);
        }
       
    }

    function approveAll() {
        setApprovedMatches((prevApproved) => [...prevApproved, ...filteredSuggestionsMatches])
        // setApprovedMatches((prevApproved) => [...prevApproved, ...calculatedMatchesToRender])
        setFilteredSuggestionsMatches([]);
    }

    function disapproveAll() {
        let disapprovedAboveThresholdMatches = [];
        let disapprovedBelowThresholdMatches = [];
        approvedMatches.forEach(match => {
            if (match.assignedMentor.totalScore >= threshold) {
                disapprovedAboveThresholdMatches.push(match)
            } else {
                disapprovedBelowThresholdMatches.push(match)
            }
        })
        setApprovedMatches([]);
        setFilteredSuggestionsMatches([...disapprovedAboveThresholdMatches, ...filteredSuggestionsMatches]);
        setBelowThresholdMatches([...disapprovedBelowThresholdMatches, ...belowThresholdMatches]);
    }

    function disapproveMatch(disapprovePair) {
        listOfApprovedMentors.current = listOfApprovedMentors.current.filter((mentorId) => mentorId !== disapprovePair.assignedMentor.mentor.id);
        console.log(disapprovePair.assignedMentor.totalScore, 'disapprovePair');
        const filteredMatches = approvedMatches.filter((suggestion) => suggestion.mentee.id !== disapprovePair.mentee.id);
        setApprovedMatches(filteredMatches)
        if (disapprovePair.assignedMentor.totalScore >= threshold) {
            setFilteredSuggestionsMatches((filteredMatchesToRender) => [disapprovePair, ...filteredMatchesToRender]);
        } else {
            setBelowThresholdMatches((existingBelowMatches) => [...existingBelowMatches, disapprovePair]);
        }
      
    }

    function addSelectedPairToDetails(mentee, selectedMentor) {
        localStorage.setItem('matchedPairs', JSON.stringify({selectedMentor, selectedMentee: mentee}));
        setShowModal({selectedMentor, selectedMentee: mentee})
    }
   

    return  (
            <div className={styles.suggested}>
                <p>Current program is: {selectedForMatching.programName}</p>
                <div className={styles['list__header-wrapper']}>
                <span className={styles.counter}>{approvedMatches.length}/{mentees1.length} Approved</span>
                {/* TODO: fix overall match */}
                    <h3 style={{marginTop: 0}} className="center">{parseInt(averageMatch)}% overall match</h3>
                    <div className={styles['approve-btn__wrapper']}>
                        <Button 
                            disabled={allApproved}
                            onClick={approveAll} 
                            className={`${allApproved ? styles['allApproved'] : ''}`} 
                            variant='contained'>
                                {allApproved ? 'All Approved' : 'Approve all'}
                        </Button>
                        <Button 
                            onClick={disapproveAll} 
                            variant='contained'>
                                Disapprove all
                        </Button>
                    </div>
                </div>
                {approvedMatches.length > 0 && <Box >
                    <h2 style={{marginTop: 0}} className="center">Approved Matches</h2>
                    <Button onClick={() => alert('It does nothing currently')} sx={{mb: '1rem'}} variant='contained'>Confirm All</Button>
                    <div className={styles['matched-pair__wrapper']}>
                        {approvedMatches.map((pair) => {
                            return <div key={pair.mentee.id} className={`${styles.suggestion} ${styles.approved}`}>
                                <div className={styles['matched-pair']}>

                                    <div className={styles['matched-pair__profile-pic']}> 
                                        <img className={styles['matched-pair__img']} src={userIco} alt="Icon" />
                                        <p>{pair.mentee.name}</p>
                                    </div>
                                    <div className={styles['matched-pair__profile-pic']}> 
                                        <img className={styles['matched-pair__img']} src={userIco} alt="Icon" />
                                        <p>{pair.assignedMentor.mentor.name}</p>
                                    </div>


                                    <div className={styles['matched-percent__wrapper']}>
                                        <p>{pair.assignedMentor.totalScore}%</p>
                                        <p>Match</p>
                                        <button onClick={() => addSelectedPairToDetails(pair.mentee, pair.assignedMentor)} className='button-clean'>Details</button>
                                    </div>
                                    <button 
                                    onClick={() => disapproveMatch(pair)}
                                        style={{marginLeft: '35px'}} 
                                        className='button-clean'>
                                        Disapprove Match
                                    </button>
                                </div>
                            </div>
                        })}
                    </div>
                </Box>}
                <Box >
                    {filteredSuggestionsMatches.length > 0 && <h2 style={{marginTop: 0}} className="center">Suggested Matches</h2>}
                    <div className={styles['matched-pair__wrapper']}>
                        {filteredSuggestionsMatches.map((pair) => {
                            return <div key={pair.mentee.id} className={styles.suggestion}>
                                <div className={styles['matched-pair']}>

                                    <div className={styles['matched-pair__profile-pic']}> 
                                        <img className={styles['matched-pair__img']} src={userIco} alt="Icon" />
                                        <p>{pair.mentee.name}</p>
                                    </div>
                                    <div className={styles['matched-pair__profile-pic']}> 
                                        <img className={styles['matched-pair__img']} src={userIco} alt="Icon" />
                                        <p>{pair.assignedMentor.mentor.name}</p>
                                    </div>


                                    <div className={styles['matched-percent__wrapper']}>
                                        <p>{pair.assignedMentor.totalScore}%</p>
                                        <p>Match</p>
                                        <button onClick={() => addSelectedPairToDetails(pair.mentee, pair.assignedMentor)} className='button-clean'>Details</button>
                                    </div>

                                    <button 
                                    onClick={() => approveMatch(pair)}
                                        style={{marginLeft: '35px'}} 
                                        className='button-clean'>
                                        Approve Match
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const currValue = typeof showCollapsed[pair.mentee.id] !== undefined ? !showCollapsed[pair.mentee.id] : true
                                            setShowCollapsed({...showCollapsed, [pair.mentee.id]: currValue });
                                        }} 
                                        style={{marginLeft: '5px'}} 
                                        className='button-clean'>
                                            Other suggestions
                                    </button>
                                </div>
                                <Collapse in={showCollapsed[pair.mentee.id]} timeout="auto" unmountOnExit>
                                    <div className={styles.collapse}>
                                        
                                    {!selectedForMatching.shouldMatchAllMentees && pair.alternativeMatches[0].totalScore < threshold ? 
                                    <h3>No alternative matches that meet required threshold of {threshold}%</h3> : (
                                        pair.alternativeMatches.map((match, i) => {
                                            const takenMentorClass = listOfAssignedMentors.current.includes(match.mentor.id) ? styles.takenMentor : styles.freeMentor
                                            if (i > 2 || !selectedForMatching.shouldMatchAllMentees && match.totalScore < threshold) return;
                                            return (
                                            <div key={match.mentor.id} className={`${styles['suggested__wrapper']} ${takenMentorClass}`}>
                                                <div key={match.mentor.mentorName} className={`${styles['matched-pair__profile-pic']} ${styles['matched-pair__mentor']}`}> 
                                                    <img className={styles['matched-pair__img']} src={userIco} alt="Icon" />
                                                    <p>{match.mentor.name}</p>
                                                </div>
                                                <div className={styles['suggested-percent__wrapper']}>
                                                    <p>Match - {match.totalScore}%</p>
                                                    {/* <button onClick={() => setShowModal(true)} >Details</button> */}
                                                    <Button onClick={() => addSelectedPairToDetails(pair.mentee, match)} variant='contained'>Details</Button>
                                                </div>
                                                <div style={{display: 'flex', alignItems: 'flex-end', marginLeft: '1rem'}}>
                                                    <Button onClick={() => createMenteeMentorsList({curPair: pair, newMentor: match})} variant='outlined'>Reassign</Button>
                                                </div>
                                            </div>
                                            )
                                            
                                        }))}
                                        <div className={styles.searchMentorSelect} ><label style={{paddingRight: '10px'}} htmlFor='specific-mentor'>Search for specific mentor</label>
                                        {/* TODO: Fix disable reassign button when select cleared */}
                                            <Autocomplete
                                                // onChange={(e, value) => console.log('CHANGE')}
                                                onChange={(e, value) => setAutoselectNewMentor(prevMentors => ({...prevMentors, [pair.mentee.id]: pair.alternativeMatches.find(match => match.mentor.name === value)}))}
                                                sx={{minWidth: '200px'}}
                                                // freeSolo
                                                id="specific-mentor"
                                                disableClearable
                                                options={mentorsBatch.map((mentor) => mentor.name)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Search mentor"
                                                        InputProps={{
                                                        ...params.InputProps,
                                                        type: 'search',
                                                        }}
                                                    />
                                                )}  
                                            />
                                            <div style={{display: 'flex', alignItems: 'flex-end', marginLeft: '1rem'}}>
                                                <Button disabled={!autoSelectNewMentor[pair.mentee.id]} onClick={() => createMenteeMentorsList({curPair: pair, newMentor: autoSelectNewMentor[pair.mentee.id]})} variant='outlined'>Reassign</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Collapse>
                            </div>
                        })}
                    </div>
                </Box>
                {/* BELOW THRESHOLD LIST */}
                {!selectedForMatching.shouldMatchAllMentees && <Box >
                    {belowThresholdMatches.length > 0 && <h2 style={{marginTop: 0}} className="center">Matches below {threshold}% threshold</h2>}
                    <div className={styles['matched-pair__wrapper']}>
                        {belowThresholdMatches.map((pair) => {
                            return <div key={pair.mentee.id} className={styles.suggestion}>
                                <div className={styles['matched-pair']}>

                                    <div className={styles['matched-pair__profile-pic']}> 
                                        <img className={styles['matched-pair__img']} src={userIco} alt="Icon" />
                                        <p>{pair.mentee.name}</p>
                                    </div>
                                    <div className={styles['matched-pair__profile-pic']}> 
                                        <img className={styles['matched-pair__img']} src={userIco} alt="Icon" />
                                        <p>{pair.assignedMentor.mentor.name}</p>
                                    </div>


                                    <div className={styles['matched-percent__wrapper']}>
                                        <p>{pair.assignedMentor.totalScore}%</p>
                                        <p>Match</p>
                                        <button onClick={() => addSelectedPairToDetails(pair.mentee, pair.assignedMentor)} className='button-clean'>Details</button>
                                    </div>

                                    <button 
                                    onClick={() => approveMatch(pair, true)}
                                        style={{marginLeft: '35px'}} 
                                        className='button-clean'>
                                        Approve Match
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const currValue = typeof showCollapsed[pair.mentee.id] !== undefined ? !showCollapsed[pair.mentee.id] : true
                                            setShowCollapsed({...showCollapsed, [pair.mentee.id]: currValue });
                                        }} 
                                        style={{marginLeft: '5px'}} 
                                        className='button-clean'>
                                            Other suggestions
                                    </button>
                                </div>
                                <Collapse in={showCollapsed[pair.mentee.id]} timeout="auto" unmountOnExit>
                                    <div className={styles.collapse}>
                                        {pair.alternativeMatches
                                        // .filter((altMatch) => 
                                        // // filter out approved mentors
                                        // !listOfApprovedMentors.current.includes(altMatch.mentor.id))
                                        .map((match, i) => {
                                            const takenMentorClass = listOfAssignedMentors.current.includes(match.mentor.id) ? styles.takenMentor : styles.freeMentor
                                            // const mentorTaken = listOfApprovedMentors.current.includes(match.mentor.id);
                                            if (i > 2) return;
                                            return (
                                            <div key={match.mentor.id} className={`${styles['suggested__wrapper']} ${takenMentorClass}`}>
                                                <div key={match.mentor.mentorName} className={`${styles['matched-pair__profile-pic']} ${styles['matched-pair__mentor']}`}> 
                                                    <img className={styles['matched-pair__img']} src={userIco} alt="Icon" />
                                                    <p>{match.mentor.name}</p>
                                                </div>
                                                <div className={styles['suggested-percent__wrapper']}>
                                                    <p>Match - {match.totalScore}%</p>
                                                    {/* <button onClick={() => setShowModal(true)} >Details</button> */}
                                                    <Button onClick={() => addSelectedPairToDetails(pair.mentee, match)} variant='contained'>Details</Button>
                                                </div>
                                                <div style={{display: 'flex', alignItems: 'flex-end', marginLeft: '1rem'}}>
                                                    <Button onClick={() => createMenteeMentorsList({curPair: pair, newMentor: match})} variant='outlined'>Reassign</Button>
                                                </div>
                                            </div>
                                            )
                                        })}
                                         <div className={styles.searchMentorSelect} ><label style={{paddingRight: '10px'}} htmlFor='specific-mentor'>Search for specific mentor</label>
                                        {/* TODO: Fix disable reassign button when select cleared */}
                                            <Autocomplete
                                                onChange={(e, value) => setAutoselectNewMentor(prevMentors => ({...prevMentors, [pair.mentee.id]: pair.alternativeMatches.find(match => match.mentor.name === value)}))}
                                                sx={{minWidth: '200px'}}
                                                freeSolo
                                                id="specific-mentor"
                                                disableClearable
                                                options={mentorsBatch.map((mentor) => mentor.name)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Search mentor"
                                                        InputProps={{
                                                        ...params.InputProps,
                                                        type: 'search',
                                                        }}
                                                    />
                                                )}  
                                            />
                                            <div style={{display: 'flex', alignItems: 'flex-end', marginLeft: '1rem'}}>
                                                <Button disabled={!autoSelectNewMentor[pair.mentee.id]} onClick={() => createMenteeMentorsList({curPair: pair, newMentor: autoSelectNewMentor[pair.mentee.id]})} variant='outlined'>Reassign</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Collapse>
                            </div>
                        })}
                    </div>
                </Box>}
                    {/* TODO: remove */}
                    <button onClick={onClose} className={styles.closeBtn}>*Dev only* X</button>
                <Snackbar open={!!showReassignAllert} autoHideDuration={3000} onClose={() => setShowReassignAlert(null)}>
                    <Alert variant="filled" severity="success">
                        Mentee {showReassignAllert?.menteeName} was reassigned with new mentor - {showReassignAllert?.mentorName}
                    </Alert>
                </Snackbar>
            </div>
    )
}

export default BatchMatchmaking;

    // type Mentor (newMantor) {
        //         age: 32,
        //         ​​​​experience: 8,
        //         ​​​​​id: 6,
        //         ​​​​​location: "City Z",
        //         ​​​​​name: "Mentor 6",
        //         ​​​​​skills: ['sdf', 'sdf']
        //     },

    // type altMatches {
    //     matchingStat: {skill: Number, exp: number, age: Number, location: sting}
    //     mentor: {
    //         age: 32,
    //         ​​​​experience: 8,
    //         ​​​​​id: 6,
    //         ​​​​​location: "City Z",
    //         ​​​​​name: "Mentor 6",
    //         ​​​​​skills: ['sdf', 'sdf']
    //     },
    //     totalScore: Number,
    // }


    // type FinalPairMatch(curPair) {
    //     alternativeMatches: Array[altMatches],
    //     assignedMentor:  {
    //         matchingStat: {
    //             skill: Number, 
    //             exp: number, 
    //             age: Number, 
    //             location: sting
    //         },
    //         mentor: Mentor,
    //         totalScore: Number,
    //     },
    //     mentee: same as Mentor,

    // }




// TRASH

// [1, 1, 2, 3, 4, 0]
function customSortASCZeroEnd(a, b) {
    if (a.matchesAmount === 0) {
      return 1; // Place zero at the end
    } else if (b.matchesAmount === 0) {
      return -1; // Place zero at the end
    } else {
      return a.matchesAmount - b.matchesAmount; // Sort other values in descending order
    }
}

// [1, 1, 1, 0, 2, 3, 4]
// function customSortASCZeroAfterOne(a, b) {
//     if (a.matchesAmount === 0 && b.matchesAmount === 1) {
//         return 1; // Place 'a' after 'b'
//     } else if (a.matchesAmount === 1 && b.matchesAmount === 0) {
//         return -1; // Place 'a' before 'b'
//     } else {
//         return a.matchesAmount - b.matchesAmount; // Normal ascending sorting
//     }
// }

// [3, 3, 2, 2, 0, 1, 1]
function customSortDESC(a, b) {
    if (b.matchesAmount === 0 && a.matchesAmount === 1) {
        return 1; // Place 'a' after 'b'
    } else if (b.matchesAmount === 1 && a.matchesAmount === 0) {
        return -1; // Place 'a' before 'b'
    } else {
        return b.matchesAmount - a.matchesAmount; // Normal ascending sorting
    }
}

// [3, 3, 2, 2, 1, 1, 0]
function sortDESC(a, b) {
        return b.matchesAmount - a.matchesAmount; 
}

// [0, 1, 1, 1, 2, 3, 4]
function sortASC(a, b) {
    return a.matchesAmount - b.matchesAmount; 
}
