import { useRef } from 'react';
import {Modal, Box} from '@mui/material';

import { addEntity } from '../../firebase/firebase';

import styles from './createTemplatePopup.module';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 620,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '5px',
    boxShadow: 24,
    p: 2,
  };

const CreateTemplatePopup = ({open, onClose, setEmailTemplates}) => {
    const inputRef = useRef(null);
    const textRef = useRef(null);

    function saveTemplate() {
        setEmailTemplates({templateName: inputRef.current.value, templateText: textRef.current.value});
        // TODO: handle error
        addEntity({templateName: inputRef.current.value, templateText: textRef.current.value}, 'EMAIL_TEMPLATES')
        onClose();
    }


    return  <Modal
            open={open}
            onClose={() => onClose()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h2 style={{marginTop: 0, marginBottom: '60px'}} className="center">Create Template</h2>
                    <div className={styles['template__wrapper']}>
                        <input ref={inputRef} className={styles['template__name']} type="text" placeholder="Template name" />
                        <div className={styles['template-text__wrapper']}>
                            <h3 className={styles['template-text__header']}>Email text to participants</h3>
                            <textarea ref={textRef} name="enrollText" id="enrollText" cols="30" rows="10" placeholder='Enrollment text'></textarea>
                        </div>
                        <button onClick={saveTemplate} className="button-clean">Create</button>
                    </div>
                    <button onClick={() => onClose()} className={styles.closeBtn}>X</button>
                </Box>
            </Modal>
}

export default CreateTemplatePopup;