import {useEffect, useContext} from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'
import Homepage from './components/pages/Homepage'
import HeaderEmployee from './components/headers/headerEmployee'
import HeaderCompany from './components/headers/headerCompany'
import PrivacyPolicyAndConditions from './components/pages/PrivacyConditions'
import AppHome from './components/pages/AppHome'
import Login from './components/pages/Login/Login.jsx'
import SignupEmployee from './components/pages/SignupEmployee'
import SignupAdmin from './components/pages/SignupAdmin'
import ForgotPassword from './components/pages/ForgotPassword'
import Footer from './components/footer';
import AppTemplateHOC from './components/HOCs/AppTemplateHOC'
import AllPrograms from './components/pages/AllPrograms';
import UserOpenProgram from './components/pages/UserOpenProgram';
import AdminOpenProgram from './components/pages/AdminOpenProgram';
import AdminClosedProgram from './components/pages/AdminClosedProgram';
import ProgramSignupUserInfo from './components/pages/ProgramSignupUserInfo';
import EmployeeProfileFillIn from './components/pages/EmployeeProfileFillIn';
import InviteParticipants from './components/pages/InviteParticipants';
import Matchmaking from './components/pages/Matchmaking';
import SingleMatching from './components/pages/SingleMatching';
import MatchedList from './components/pages/MatchedList';
import CreatePrograms from './components/pages/CreatePrograms';
import BatchMatching from './components/pages/BatchMatching';
import MatchMakingDetailsPopup from './components/matchMakingDetailsPopup';
import Snackbar from './components/Snanckbar/Snackbar';

import { auth, getEntities } from './firebase/firebase';

import { onAuthStateChanged } from 'firebase/auth';
import { MatchDetailsContext } from './Providers/MatchDetailsPopupProvider';
import { ExistingProgramsContext } from './Providers/ExistingProgramsProvider';
import { UserAuthContext } from './Providers/AuthProvider';
import { EmailsTemplates } from './Providers/InviteParticipantsTemplatesProvider';
import { SnackbarContext } from './Providers/SnackbarProvider';



import './App.scss'

const pagesWithoutHeaderandBottom = [
  '/login', 
  '/forgot-password', 
  '/signup', 
  '/signup-admin', 
  '/signup-employee',
  '/employee-profile-fill-in'
]

const errorMsgStyles = {
  height: '80vh', 
  display: 'grid', 
  placeItems: 'center', 
  fontSize: '40px',
  fontWeight: 'bold',
  color: 'red',
}

function App() {
  const {pathname} = useLocation();
  const {user, setUser} = useContext(UserAuthContext);
  const {showMatchedDetailsModal, setShowModal} = useContext(MatchDetailsContext);
  const { showSnackbar } = useContext(SnackbarContext); 
  const displayHeaderAndFooter = !pagesWithoutHeaderandBottom.includes(pathname);

  const {setExistingPrograms} = useContext(ExistingProgramsContext)
  const {setEmailTemplates} = useContext(EmailsTemplates)

  useEffect(() => {
    const curUser = auth.currentUser;
      
    if (curUser) {
      // console.warn(' User exist!');
      // console.warn(curUser.email, 'curUser ALL PROGS');
      setUser('user')
    } else {
      // console.warn(' NO ACTIVE USER');
    }

    // onAuthStateChanged(auth, (user) => {
    //   console.log('User status changed: ', user);
    //   if (user) {
    //     setUser(user)
    //   } else {
    //     setUser(null)
    //   }
    // })

    console.log(showSnackbar, 'showSnackbar');


    getEntities('PROGRAMS')
        .then((programs) => {
          const sortedPrograms = programs.sort((program1, program2) => {
            return program1.programName.toLowerCase() > program2.programName.toLowerCase();
          });
          console.log(sortedPrograms, 'sortedPrograms');
            setExistingPrograms({programs: sortedPrograms})
        })

    getEntities('EMAIL_TEMPLATES')
        .then((emailTemplates) => {
            setEmailTemplates((prevTemplates) => ([...prevTemplates, ...emailTemplates]))
    })

}, [])

  
  return (
    <>
       {displayHeaderAndFooter && <HeaderEmployee curUser={user} />}
      {/* <HeaderCompany /> */}
      {showMatchedDetailsModal && <MatchMakingDetailsPopup open={!!showMatchedDetailsModal} onClose={setShowModal} />}
      <main className={`container ${displayHeaderAndFooter ? '' : 'no-header'}`}>
        <Routes>
          <Route path='/' element={< Homepage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/signup-employee' element={<SignupEmployee />} />
          <Route path='/signup-admin' element={<SignupAdmin />} />
          <Route path='/privatlivspolitik-og-betingelser' element={<PrivacyPolicyAndConditions />} />
          <Route path='/employee-profile-fill-in' element={<EmployeeProfileFillIn />} />
          <Route path='/all-programs' element={<AllPrograms />} />
          <Route path='/user-open-program/:programId' element={<UserOpenProgram />} />
          {/* <Route path='/user-closed-program/:programId' element={<UserClosedProgram />} /> */}
          <Route path='/admin-open-program/:programId' element={<AdminOpenProgram />} />
          <Route path='/admin-closed-program/:programId' element={<AdminClosedProgram />} />
          <Route path='/prog-signup-userinfo' element={<ProgramSignupUserInfo />} />
          <Route path='/invite-participants' element={<InviteParticipants />} />
          <Route path='/matchmaking' element={<Matchmaking />} />
          <Route path='/matchmaking/single-matching' element={<SingleMatching backBtn={true}/>} />
          <Route path='/matchmaking/batch-matching' element={<BatchMatching />} />
          <Route path='/matched-list/:userId' element={<MatchedList />} />
          <Route path='/create-programs' element={<CreatePrograms />} />
          {/* <Route path='/create-template' element={<CreateTemplate />} /> */}
          
          <Route path='/apphome'  element={<AppHome/>}/>
           {/* 404 */}
          <Route path='/*' element={<div style={errorMsgStyles}>Resource at {pathname} <br/>404 Not Found</div>} />
        </Routes>
      </main>
      {displayHeaderAndFooter && <Footer />}
      
      <Snackbar/>
    </>
  )
}


export default App
