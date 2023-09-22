import { useState, createContext } from "react";

export const SnackbarContext = createContext({open: false, msg: ''})

const SnackbarProvider = ({children}) => {
    const [showSnackbar, setShowSnackbar] = useState({open: false, msg: ''});

    return <SnackbarContext.Provider value={{showSnackbar, setShowSnackbar}}>
            {children}
        </SnackbarContext.Provider>

}

export default SnackbarProvider;