import React, { useState, createContext } from "react";

export const ExistingProgramsContext = createContext({programs: []});

const programsDetails = {
    programs: [],
    newlyAddedProgram: null,
    selectedForMatching: null,
}

export const ExistingProgramsProvider = ({children}) => {
    const [existingPrograms, setExistingPrograms] = useState(programsDetails);

    return (
        <ExistingProgramsContext.Provider value={{existingPrograms, setExistingPrograms}}>
            {children}
        </ExistingProgramsContext.Provider>
    )
}
