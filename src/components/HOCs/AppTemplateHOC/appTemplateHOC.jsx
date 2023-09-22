import {useState, useEffect, useContext} from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import { NavLink, Link, useNavigate } from 'react-router-dom';
import { UserAuthContext } from '../../../Providers/AuthProvider';
import { auth } from '../../../firebase/firebase';
import { signOut } from 'firebase/auth';

import icons from '../../../assets/icons.svg';
import backBtnIco from '../../../assets/back-btn.png';


const HomeIcon = icons + '#home';
const MessagesIcon = icons + '#messages';
const ProfileIcon = icons + '#profile';
const CompassIcon = icons + '#compass';
const InfoIcon = icons + '#infooutline';
const LogoutIcon = icons + '#logout';
const Plus = icons + '#plus';

import styles from './styles.module';

const adminSidebarElems = [
  {
    btnText: 'Programs',
    btnLink: '/create-programs',
    btnIcon: HomeIcon,
  },
  {
    btnText: 'Invite',
    btnLink: '/invite-participants',
    btnIcon: MessagesIcon,
  },
  {
    btnText: 'Matching',
    btnLink: '/matchmaking',
    btnIcon: ProfileIcon,
  },
  {
    btnText: 'Admin',
    btnLink: '/all-programs',
    btnIcon: CompassIcon,
  },
];

const userSidebarElems = [
  {
    btnText: 'Programs',
    btnLink: '/all-programs',
    btnIcon: HomeIcon,
  },
];

const AppTemplateHOC = (WrappedComponent, props) => {
  const WrappedContent = () => {
    const navigate = useNavigate();
    const {user} = useContext(UserAuthContext);
    const linksToRender = user === null ? adminSidebarElems : userSidebarElems;

    function signOutUser() {
      signOut(auth)
          .then(() => {
              console.log('User Signed Out');
              navigate('/login')
          })
          .catch(err => {
              console.error('There was an error while signing out the user');
          })
  }

  function navigateBack() {
    navigate(-1);
  }

    return <div style={{
      width: '100%', 
      // height: 'calc(100vh - 139px)', 
      // position: 'relative', 
      // paddingLeft: '75px',
      }}>
      <aside className={styles['sidebar-nav']}>
        {/* TODO: bring back circular progress */}
        {props?.backBtn && <button className={styles.backBtn} onClick={navigateBack}><img src={backBtnIco} alt="back button" /></button>}
      <ul className={styles['sidebar-list']}>
           {linksToRender.map((elem) => {
            return  <li key={elem.btnText} className={styles['sidebar-list__item']}>
            <NavLink to={elem.btnLink} className={({isActive}) => isActive ? styles['active'] : ''}>
                <div className={styles['list-item__svg']}>                
                    <svg>
                        <use xlinkHref={elem.btnIcon}></use>
                    </svg>
                </div>
                <p className={styles['list-item__text']}>{elem.btnText}</p>
            </NavLink>
          </li>
          })}
        </ul>
          {/* <CircularProgress sx={{position: 'relative', top: '35%', left: '20%'}} color='success' />} */}
        
        <ul className={`${styles['sidebar-list']} ${styles['sidebar-list--bottom']}`}>
            <li className={styles['sidebar-list__item']}>
              <Link to='/info' >
                  <div className={styles['list-item__svg']}>                
                      <svg>
                          <use xlinkHref={InfoIcon}></use>
                      </svg>
                  </div>
                  <p className={styles['list-item__text']}>Info</p>
              </Link>
            </li>
            <li className={styles['sidebar-list__item']}>
              <Link to='/signup-employee' >
                  <div className={styles['list-item__svg']}>                
                      <svg>
                          <use xlinkHref={Plus}></use>
                      </svg>
                  </div>
                  <p className={styles['list-item__text']}>SignUp</p>
              </Link>
            </li>
            <li className={styles['sidebar-list__item']}>
              <div onClick={signOutUser} >
                  <div className={styles['list-item__svg']}>                
                      <svg>
                          <use xlinkHref={LogoutIcon}></use>
                      </svg>
                  </div>
                  <p className={styles['list-item__text']}>Signout</p>
              </div>
            </li>
        </ul> 
      </aside>
      <div style={{paddingLeft: '90px', paddingRight: '15px'}}><WrappedComponent /></div>
      
    </div>
             
}

  return WrappedContent;
}

export default AppTemplateHOC;