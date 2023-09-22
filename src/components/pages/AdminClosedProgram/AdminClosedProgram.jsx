import AppTemplateHOC from '../../HOCs/AppTemplateHOC';

import styles from './styles.module';

const AdminClosedProgram = () => {
    return (
        <>
        <div className={styles['program-container']}>
            <h1>Name of Closed program</h1>

            <div className={styles['program-content']}>
            <div className={styles['content-top']}>
                <div className={styles['content-top__block']}>
                    <h4 className={styles['block__header']}>Number of enrolls</h4>
                    <span>Number of mentees</span>
                    <span>Number of mentors</span>
                </div>
                <div className={styles['content-top__block']}>
                    <h4 className={styles['block__header']}>Number of matches</h4>
                    <span>Number of mentees</span>
                    <span>Number of mentors</span>
                </div>
                <div className={styles['content-top__block']}>
                    <h4 className={styles['block__header']}>Start Matching</h4>
                    <button>Single</button>
                    <button>Batch</button>
                </div>
            </div>
            <div className={styles['content__activity']}>
                <h4>Recent Activity</h4>
                <p>Area with recent activities such as new enrolls, new matches and in the future more data points</p>
            </div>
            </div>
        </div>
        </>
    )
}

export default AppTemplateHOC(AdminClosedProgram);