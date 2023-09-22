import {useState, useEffect} from 'react';
import AppTemplateHOC from "../../HOCs/AppTemplateHOC"
import BatchMatchmaking from "../../batchMatchmaking";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import styles from './batchMatching.module';

const BatchMatching = () => {
    const [showSuggestedMatch, setShowSuggestedMatch] = useState(false);
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        handleShow()
    }, [])

    function handleShow() {
        let randomTimer = Math.ceil(Math.random() * 3000);
        console.log(randomTimer, 'randomTimer');
        randomTimer = randomTimer < 1000 ? 1000 : randomTimer;
        setTimeout(() => {
            setShowLoader(false);
            setShowSuggestedMatch(true);
        }, randomTimer)
    }

    return (
        <>
        <h1>Matchmaking</h1>
        <div className={styles['select-program__wrapper']}>
            {showLoader && <Box sx={{ width: '75%', paddingTop: '1rem' }}>
                <CircularProgress color="success" />
            </Box>}

            {showSuggestedMatch && <BatchMatchmaking />}            
        </div>
        </>
    )
}

export default AppTemplateHOC(BatchMatching, {backBtn: true})