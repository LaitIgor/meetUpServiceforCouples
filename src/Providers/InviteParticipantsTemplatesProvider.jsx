import { useState, createContext, useEffect } from "react";

export const EmailsTemplates = createContext();

export const InviteParticipantsTemplateProvider = ({children}) => {
    const [emailTemplates, setEmailTemplates] = useState([{templateName: '', templateText: ''}]);

    return (
        <EmailsTemplates.Provider value={{emailTemplates, setEmailTemplates}}>
            {children}
        </EmailsTemplates.Provider>
    )
}