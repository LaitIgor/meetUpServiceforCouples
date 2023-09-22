import {useState, useContext, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import AppTemplateHOC from "../../HOCs/AppTemplateHOC"
import {MatchDetailsContext} from "../../../Providers/MatchDetailsPopupProvider";

import userIco from '../../../assets/user-ico.png';
import styles from './matchedList.module';

import {mentees, mentors} from '../../../usersList';

// if (a.matchesAmount === 0 && b.matchesAmount === 1) {
//     return 1; // Place 'a' after 'b'
// } else if (a.matchesAmount === 1 && b.matchesAmount === 0) {
//     return -1; // Place 'a' before 'b'
// } else {
//     return a.matchesAmount - b.matchesAmount; // Normal ascending sorting
// }

const MatchedList = () => {
    const {setShowModal} = useContext(MatchDetailsContext);
    const [matchesList, setMatchesList] = useState([])
    const {userId} = useParams();
    const suggestedMatches = [];

    const selectedUser = mentees.find((user) => userId === user.id.toString());
    // console.log(selectedUser, 'selectedUser');
    // selectedUser.suggestedMatches.sort((user1, user2) => user2.matchingPercent - user1.matchingPercent)

    useEffect(() => {
        singleMatchmaking(selectedUser);
    }, [])


    function singleMatchmaking(mentee) {
        const menteeSkills = mentee.skills;
        const menteeExperience = mentee.experience;
        const menteeAge = mentee.age;
        const menteeLocation = mentee.location;

        let matchesList = [];
        mentors.forEach((mentor, i) => {
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
            }

            // Age compatibility estimation
            const ageDifference = mentorAge - menteeAge;
            if (ageDifference >= 5) {
                currentMentor.matchingStat.age = 100;
                currentMentor.totalScore += 10;
            } else if (ageDifference >=3 && ageDifference < 5) {
                currentMentor.matchingStat.age = 50;
                currentMentor.totalScore += 5;
            }

            // Location compatibility estimation
            if (mentorLocation === menteeLocation) { 
                currentMentor.matchingStat.location = 100;
                currentMentor.totalScore += 10;
            }

            matchesList.push(currentMentor);
        })
        // console.log(matchesList, 'matchesList');

        matchesList.sort((match1, match2) => match2.totalScore - match1.totalScore);
        setMatchesList(matchesList);
        // setMatchesList(matchesList.slice(0,3));
    }

    function addSelectedMentor(pickedMentorName) {
        const selectedMentor = matchesList.find((mentor) => mentor.mentor.name === pickedMentorName)
        localStorage.setItem('matchedPairs', JSON.stringify({selectedMentor, selectedMentee: selectedUser.name}))
        setShowModal({selectedMentor, selectedMentee: selectedUser})
    }

    return (
        <>
            <h3 className={styles['user-name']}>{selectedUser.name}</h3>

            <div className={styles['selected-user']}>
                    <img className={styles['selected-user__img']} src={userIco} alt="Icon" />
                    <p className={styles['selected-user__text']}> 
                    Display area for info such as:Name, title, competencies, language, work area & about me</p>
            </div>

            <div className={styles.suggestions}>
                {matchesList.length > 0 && <h2>{`Suggestions for ${selectedUser.name}`}</h2>}

                
                {matchesList.length ? matchesList.map(({mentor, totalScore}) => {
                    return  <div key={mentor.name} className={styles['result__wrapper']}> 
                    <div className={styles['result']}>
                        <div className={styles['result__profile-wrapper']}> <img className={styles['result__img']} src={userIco} alt="Icon" /> <p>{mentor.name}</p></div>
                        <p className={styles['result__text']}> 
                        Display area for info such as:Name, title, competencies, language, work area & about me</p>
                    </div>

                    <div className={styles['matched-percent__wrapper']}>
                        <p>{totalScore}%</p>
                        <p>Match</p>
                        <button onClick={() => addSelectedMentor(mentor.name)} className='button-clean'>Details</button>
                    </div>
            </div>
                }) : <p>Unfortunately we couldn`t have found any matches</p>}

            </div>

        </>
    )
}

export default AppTemplateHOC(MatchedList, {backBtn: true});