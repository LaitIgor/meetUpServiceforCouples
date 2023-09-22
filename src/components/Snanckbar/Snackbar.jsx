import { useState, useContext, useEffect } from 'react';
import { SnackbarContext } from '../../Providers/SnackbarProvider';
import { Slide, Alert, Snackbar as SnackBarFromMui } from '@mui/material';

const Snackbar = () => {
    const { showSnackbar, setShowSnackbar } = useContext(SnackbarContext); 

    // console.log(showSnackbar, '1');

    useEffect(() => {
        console.warn('Mount check');
    }, [])

    useEffect(() => {
        console.log(showSnackbar, 'changed');
        // Add a cleanup function to unsubscribe from context when the component unmounts
        return () => {
            console.log('UNmount check');
        }
    }, [showSnackbar.open]); 

    function closeSnackbar() {
        console.log(111);
        setShowSnackbar({open: false, msg: ''})
    }


    // return <div>123123</div>

    return  <SnackBarFromMui
            open={showSnackbar.open}
            autoHideDuration={2000}
            onClose={closeSnackbar}
            TransitionComponent={Slide}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            message="Program was successfully deleted"
            disableWindowBlurListener={true}
            >
            <Alert severity="success" variant="filled">
                Program was successfully deleted
            </Alert>
            </SnackBarFromMui>

// return  <Snackbar
// open={showSnackbar.open}
// autoHideDuration={2000}
// onClose={closeSnackbar}
// TransitionComponent={Slide}
// anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
// message="Program was successfully deleted"
// >
// <Alert severity="success" variant="filled">
//     Program was successfully deleted
// </Alert>
// </Snackbar>
}

export default Snackbar;