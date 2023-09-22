import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

import { LanguageProvider } from './Providers/LanguageProvider.jsx'
import AuthProvider from './Providers/AuthProvider.jsx';
import { MatchDetailsPopupProvider } from './Providers/MatchDetailsPopupProvider.jsx';
import { ExistingProgramsProvider } from './Providers/ExistingProgramsProvider.jsx';
import { InviteParticipantsTemplateProvider } from './Providers/InviteParticipantsTemplatesProvider.jsx';
import SnackbarProvider from './Providers/SnackbarProvider.jsx';

// TODO: remove
import './firebase/firebase';

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <LanguageProvider>
        <MatchDetailsPopupProvider>
          <ExistingProgramsProvider>
            <InviteParticipantsTemplateProvider>
              <BrowserRouter>
                <SnackbarProvider>
                  <App />
                </SnackbarProvider>
              </BrowserRouter>
            </InviteParticipantsTemplateProvider>
          </ExistingProgramsProvider>
        </MatchDetailsPopupProvider>
      </LanguageProvider>
    </AuthProvider>
)
