import React, { createContext, useState } from 'react';

export const MatchDetailsContext = createContext();

export const MatchDetailsPopupProvider = ({ children }) => {
  const [showMatchedDetailsModal, setShowModal] = useState(false);

  return (
    <MatchDetailsContext.Provider value={{ showMatchedDetailsModal, setShowModal }}>
      {children}
    </MatchDetailsContext.Provider>
  );
};