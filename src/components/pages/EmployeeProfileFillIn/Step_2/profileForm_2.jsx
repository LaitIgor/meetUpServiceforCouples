import Button from '@mui/material/Button';
import styles from './styles.module';

const UserProfileForm_2 = ({prevStep, setValue}) => {
    // TODO: Get here only if prev filled in, otherwise return
    return  (
    <> 
        <div style={{maxWidth: '75%', textAlign: 'left'}}>
            <h3 style={{textAlign: 'center'}}>Choose skills you currently have</h3>
            <div className={styles['block-wrapper']}>
                <p className={styles.skill}>IT</p>
                <p className={styles.skill}>Business</p>
                <p className={styles.skill}>Public relations</p>
                <p className={styles.skill}>Marketing</p>
                <p className={styles.skill}>skill-x</p>
                <p className={styles.skill}>skill-y</p>
                <p className={styles.skill}>skill-z</p>
                <p className={styles.skill}>...etc</p>
            </div>

        </div>
        <div>
            <button style={{marginRight: '1rem'}} className={styles.next} onClick={prevStep}>Back</button>
            <Button className={styles.next} type='submit' variant='contained'>Create profile</Button>
        </div>
    </>
    )
   
}

export default UserProfileForm_2;