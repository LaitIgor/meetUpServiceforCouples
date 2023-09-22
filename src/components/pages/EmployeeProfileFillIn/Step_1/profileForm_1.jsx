
import styles from './styles.module';

const UserProfileForm_1 = ({nextStep, setValue}) => {
    return  (
    <> 
        <div className={styles['form-group__wrapper']}>
            <div className={styles['input-wrapper']}>
                <label>First Name
                    <input 
                        type="text" 
                        name="firstName" 
                        placeholder='First Name' 
                        onChange={setValue}
                    />
                </label>
            </div>
            <div className={styles['input-wrapper']}>
                <label>Last Name
                    <input 
                        type="text" 
                        name="lastName" 
                        placeholder='Last Name' 
                        onChange={setValue}
                    />
                </label>
            </div>
            <div className={styles['input-wrapper']}>
                <label>Job Title
                    <input 
                        type="text"
                        name="jobTitle"
                        placeholder='Job Title' 
                        onChange={setValue}
                    />
                </label>
            </div>
            <div className={styles['input-wrapper']}>
                <label>Role
                    <input 
                        type="text" 
                        name="role"
                        placeholder='Role' 
                        onChange={setValue}
                    />
                </label>
            </div>
            <div className={styles['input-wrapper']}>
                <label>Experience
                    <input 
                        type="text" 
                        name="experience"
                        placeholder='Experience' 
                        onChange={setValue}
                    />
                </label>
            </div>
            <div className={styles['input-wrapper']}>
                <label>Age
                    <input 
                        type="text" 
                        name="age"
                        placeholder='Age' 
                        onChange={setValue}
                    />
                </label>
            </div>
            <div className={styles['input-wrapper']}>
                <label>Year Joined Organization
                    <input 
                        type="text" 
                        name="yearJoineOrg"
                        placeholder='Year Joined Organization' 
                        onChange={setValue}
                    />
                </label>
            </div>
            <div className={styles['input-wrapper']}>
                <label>Manager Name
                    <input 
                        type="text" 
                        name="managerName"
                        placeholder='Manager Name' 
                        onChange={setValue}
                    />
                </label>
            </div>
            <div className={styles['input-wrapper']}>
                <label>Region
                    <input 
                        type="text" 
                        name="region"
                        placeholder='Region' 
                        onChange={setValue}
                    />
                </label>
            </div>
            <div className={styles['input-wrapper']}>
                <label>Gender
                    <input 
                        type="text" 
                        name="gender"
                        placeholder='Gender' 
                        onChange={setValue}
                    />
                </label>
            </div>
        </div>
        <button className={styles.next} onClick={nextStep}>Next</button>
    </>
    )
   
}

export default UserProfileForm_1;