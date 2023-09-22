import { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdmissionForm from '../../HOCs/AdmissionFormHOC';
import { LanguageContext } from '../../../Providers/LanguageProvider';

import languages from '../../../dictionary';

import icons from '../../../assets/icons.svg'
import pageImage from '../../../assets/signup-x2.jpg';
const GlobeIcon = icons + '#globe';
const ChevronIcon = icons + '#chevron';

import '../../../firebase/firebase';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, getSingleEntity, getEntities } from '../../../firebase/firebase';

const SignupEmployee = () => {
    const navigate = useNavigate();
    const [disableBtn, setDisableBtn] = useState(false);
    const [passwordsError, setPasswordsError] = useState(false);
    const [termsAndCondChecked, setTermsAndCondChecked] = useState(false);
    const {selectedLanguage, setSelectedLanguage} = useContext(LanguageContext);
    const selectValue = selectedLanguage === 'dk' ? 'Danish' : 'English';

    const emailRef = useRef(null);
    const passRef = useRef(null);
    const repeatPassRef = useRef(null);


    const dictionary = languages[selectedLanguage].signup;

    const formSubmit = (e) => {
        e.preventDefault();
        setDisableBtn(true);
        let email = emailRef.current;
        let pass = passRef.current;
        let pass2 = repeatPassRef.current;
        if (pass.value !== pass2.value) {
            setDisableBtn(false);
            return setPasswordsError(true)
        }
        setPasswordsError(false)
        // if (!email.value || !pass.value || !pass2.value) return

        getSingleEntity(email.value)
            .then((res) => {
                if (!res) {
                    alert('An account with this email is not in the system. Please contact your administrator.')
                    emailRef.current.value = '';
                    passRef.current.value = '';
                    repeatPassRef.current.value = '';
                    setTermsAndCondChecked(false);
                    return setDisableBtn(false);
                } else {
                    // alert('Access granted, plese come in :)');
                    createUserWithEmailAndPassword(auth, email.value, pass.value)
                    .then(userCredential => {
                        console.log('user created: ', userCredential.user);
        
                        const user = userCredential.user;
                        console.log(user, 'NEW USER OBJECT');
                        console.log(user.auth.updateCurrentUser, 'NEW USER OBJECT FUNCTION!');
                        
                        updateProfile(userCredential.user, {
                            displayName: 'user',
                        })
                        .then((newProf) => {
                            console.log(newProf, 'Profile Updated!');
                            setDisableBtn(false);
                            navigate('/employee-profile-fill-in');
                        })
                    })
                    .catch(err => {
                        alert('User with this email already exists, please log in');
                        console.error('There was an error ', err);
                        // console.error('there was an error while creating a user: ', err);
                        // alert('An account with this email already exists. Please log in to access the system.')
                        // emailRef.current.value = '';
                        // passRef.current.value = '';
                        // repeatPassRef.current.value = '';
                        // setTermsAndCondChecked(false);
                        // return setDisableBtn(false);
                    })
                    .finally( () => {
                        setTermsAndCondChecked(false);
                        return setDisableBtn(false);
                    }) 
                }
            })


    }

    const passwordErrorClass = passwordsError ? 'signupEmployee-form__pass--error' : '';

    return (
            <>
            <h3 className='signupEmployee-form__header'>{dictionary.createEmployeeTitle}</h3>
            <form onSubmit={formSubmit}>
                <div className="signupEmployee-form__group signupEmployee-form__email">
                    <label htmlFor="email">{dictionary.emailLabel}</label>
                    <input required ref={emailRef} type="email" placeholder={dictionary.inputPlaceholder} id='email'/>
                </div>
                <div className={`signupEmployee-form__group signupEmployee-form__pass ${passwordErrorClass}`}>
                    <label htmlFor="password">{dictionary.passwordLabel}</label>
                    <input required ref={passRef} type="password" id='password'/>
                </div>
                <div className={`signupEmployee-form__group signupEmployee-form__pass ${passwordErrorClass}`}>
                    <label htmlFor="confirmPass">{dictionary.passwordConfirm}</label>
                    <input required ref={repeatPassRef} type="password" id='confirmPass'/>
                </div>

                <div className="form__checkbox checkbox-wrapper">
                    <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        onChange={() => setTermsAndCondChecked(!termsAndCondChecked)}
                        checked={termsAndCondChecked}
                        required
                    />
                    <label htmlFor="consent">{dictionary.termsAndCondText}
                        {/* {this.props.t('signup.i_accept')}  */}
                        <Link to='/privatlivspolitik-og-betingelser'>{dictionary.termsAndCondLink}</Link>
                    </label>
                </div>

                <button disabled={disableBtn} type='submit'>{disableBtn ? 'Signing Up' :  dictionary.formBtn}</button>
            </form>

            <div className="signupEmployee-actions">
                <p>{dictionary.haveProfileText}
                    <Link to='/login'>{dictionary.haveProfileLink}</Link>
                </p>
            </div>

            <div className='signupEmployee-select__wrapper'>
                <label htmlFor="languages">
                    <svg style={{width: '18px', height: '12px', marginRight: '10px'}}>
                        <use xlinkHref={GlobeIcon}></use>
                    </svg>
                    <span>{selectValue}</span>
                    <svg style={{width: '12px', height: '12px', marginLeft: 'auto'}}>
                        <use xlinkHref={ChevronIcon}></use>
                    </svg>
                </label>
                <select 
                    className='signupEmployee-select' 
                    name="languages" 
                    id="languages" 
                    defaultValue='dk'
                    onChange={(e) => {
                        console.log(e.target.value);
                        setSelectedLanguage(e.target.value);
                    }}
                >
                    <option value="dk">Danish</option>
                    <option value="en">English</option>
                </select>
            </div>
            </>
    )
}

export default AdmissionForm(SignupEmployee, pageImage);