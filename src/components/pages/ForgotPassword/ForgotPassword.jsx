import {useContext} from 'react'
import {Link} from 'react-router-dom';
import AdmissionForm from '../../HOCs/AdmissionFormHOC';
import {LanguageContext} from '../../../Providers/LanguageProvider';
import languages from '../../../dictionary';

export const ForgotPassword = () => {
    const {selectedLanguage} = useContext(LanguageContext);

    const formSubmit = (e) => {
        e.preventDefault();
        if (!e.target[0].value ) return
        alert(`email: ${e.target[0].value}`);
    }

    return (
            <>
                <h3 className="forgotPass-form__header">{languages[selectedLanguage].newPassFormHeader}</h3>
                <form onSubmit={formSubmit}>
                    <div className="forgotPass-form__group forgotPass-form__email">
                        <label htmlFor="forgotPass">{languages[selectedLanguage].newPassLabel}</label>
                        <input type="email" placeholder={languages[selectedLanguage].emailPlaceholder} id='forgotPass'/>
                    </div>
                    <button type='submit'>{languages[selectedLanguage].newPassActionBtn}</button>
                </form>

                <div className="forgotPass-actions">
                    <p><Link to='/login'>{languages[selectedLanguage].logInHere}</Link></p>
                </div>
            </>
            )
}

export default AdmissionForm(ForgotPassword);