import {Link, useLocation} from 'react-router-dom';

import Logo from '../../../assets/logo-x2.png'
import LoginImg from '../../../assets/login-x2.jpg';
import pageImage from '../../../assets/signup-x2.jpg';
import './admission.scss'

export const AdmissionFormHOC = (WrappedLogin, imageSrc) => {
    const WrappedAdmissionForm = (props) => {
        const location = useLocation();

        return (
            <div className='login-wrapper'> 
                <div className='login-form'> 
                     <Link to='/'>
                        <img className='login-form__logo' src={Logo} alt="Career mentor logo" />
                    </Link> 
                    <div className='login-form__inner'>
                        <WrappedLogin {...props}/>
                    </div>
                </div> 
                <div className='login-image__wrapper'>
                    <img src={imageSrc || LoginImg} alt="Mentor and mentee talking" />
                </div> 
             </div>
        )

    }

    return WrappedAdmissionForm;
   
}
