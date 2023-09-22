import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { addEntity } from '../../../firebase/firebase';

import AppTemplateHOC from "../../HOCs/AppTemplateHOC";
import CreateTemplatePopup from "../../createTemplatePopup/createTemplatePopup";
import { ExistingProgramsContext } from '../../../Providers/ExistingProgramsProvider';
import { defaultProgramValues } from '../CreatePrograms/CreatePrograms';
import { InviteParticipantsTemplateProvider, EmailsTemplates } from '../../../Providers/InviteParticipantsTemplatesProvider';

import { Button, Backdrop, CircularProgress, Tooltip } from '@mui/material';
import { WithContext as ReactTags } from 'react-tag-input';

import styles from './inviteParticipants.module';

const explainingTextPlaceholder = "Textbox for free input for text to be included in enrollment email";
const defaultTemplateOption = {templateName: '', templateText: ''};
const Keys = {
    TAB: 9,
    SPACE: 32,
    COMMA: 188,
};

const InviteParticipants = () => {
    const [followTextValue, setFollowTextValue] = useState(explainingTextPlaceholder);

    const {existingPrograms, setExistingPrograms} = useContext(ExistingProgramsContext);
    const {emailTemplates, setEmailTemplates} = useContext(EmailsTemplates);
    const [showLoader, setShowLoader] = useState(false);
    
    // Boolean for template creation modality
    const [creteTemplateOpen, setCreateTemplateOpen] = useState(false);

    // Value of program select
    const [selectedProgramOption, setSelectedProgramOption] = useState(defaultProgramValues);

    // Value of Template select
    const [selectedTemplateOption, setSelectedTemplateOption] = useState(defaultTemplateOption);

    const navigate = useNavigate();

      // ReactTags
      const [tags, setTags] = useState([]);
    
      const handleDelete = i => {
        setTags(tags.filter((tag, index) => index !== i));
      };
    
      const handleAddition = tag => {
        console.log(tag, 'tagtagtag');
        setTags([...tags, tag]);
      };
    
      const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();
    
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
    
        // re-render
        setTags(newTags);
      };
    
      const handleTagClick = index => {
        console.log('The tag at index ' + index + ' was clicked');
      };
      // ReactTags

    useEffect(() => {
        if (selectedTemplateOption.templateText) {
        setFollowTextValue(selectedTemplateOption.templateText)
        } else {
            setFollowTextValue(explainingTextPlaceholder)
        }

    }, [selectedTemplateOption])



    useEffect(() => {
        if (existingPrograms.programs.length > 0 ) {
            if (existingPrograms.newlyAddedProgram) {
                const findIndexOfNewlyAddedProgram = existingPrograms.programs.findIndex(program => program.programName === existingPrograms.newlyAddedProgram) || 0
                setSelectedProgramOption(existingPrograms.programs[findIndexOfNewlyAddedProgram])
                setExistingPrograms((programs) => ({...programs, newlyAddedProgram: null}))
                
            } else {
                setSelectedProgramOption(existingPrograms.programs[0])
            }
        };
        // if (emailTemplates.length > 0) setSelectedTemplateOption(emailTemplates[0]);
    }, [existingPrograms.programs, emailTemplates])

    function addTemplate(newTemplate) {
        setEmailTemplates([ ...emailTemplates, newTemplate])
        setSelectedTemplateOption(newTemplate);
    }

    function handleProgramSelectChange(event) {
        const findNewlySelectedProgram = existingPrograms.programs.find((program) => program.programName === event.target.value)
        setSelectedProgramOption(findNewlySelectedProgram);
    };

    function handleTemplateSelectChange(event) {
        const changeTemplate = emailTemplates.find(template => template.templateName === event.target.value)
        setSelectedTemplateOption(changeTemplate);
    };

    function openCreateTemplate() {
        setCreateTemplateOpen(true)
    }

    function closeCreateTemplate() {
        setCreateTemplateOpen(false)
    }

    function sendInvites() {
        if (tags.length === 0) return alert('PLease input atleast one email');
        setShowLoader(true)
        setTimeout(() => {
            setShowLoader(false);
            addEntity(...tags, 'USERS');
            navigate('/signup-employee')
        }, 2500)

    }



    const isSelectProgramDisabled = existingPrograms.programs.length === 0;

  

    return (
        <>
        {creteTemplateOpen && <CreateTemplatePopup open={creteTemplateOpen} onClose={closeCreateTemplate} setEmailTemplates={addTemplate} />}
            <h1 className={styles['header-text']}>Invite Participants</h1>
            
            <div className={styles['invite__wrapper']}>
                <h3 style={{margin: 0, padding: 0}}>Select Program</h3>
                <select 
                onChange={handleProgramSelectChange} 
                disabled={isSelectProgramDisabled} 
                value={selectedProgramOption.programName || ''} 
                style={{width: '130px', padding: '6px', backgroundColor: 'transparent', border: '2px solid black', borderRadius: '5px'}} name="existingPrograms" id="existingPrograms"
                >
                {isSelectProgramDisabled && <option value="" disabled>No programs</option>}
                        {existingPrograms.programs.map(program => <option key={program.programName} value={program.programName}>{program.programName}</option>)}
                </select>
                <div className={styles['invite__template-block']}>
                    <h4 className={styles['template-block__header']}>Email list</h4>
                    {/* Fix bug not importing multiple emails after copy-paste */}
                        <ReactTags
                        classNames={{
                            // main wrapper of all chips
                            tags: styles['invite__template-tags'],
                            // chips inner wrapper
                            selected: styles['invite__template-selected'],
                            // chip
                            tag: styles['invite__template-tag'],
                            remove: styles['invite__template-remove'],
                            tagInputField: styles['invite__template-tagInputField'],

                        }}
                        allowAdditionFromPaste={true}
                        tags={tags}
                        delimiters={[Keys.COMMA]}
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        // handleDrag={handleDrag}
                        handleTagClick={handleTagClick}
                        inputFieldPosition="bottom"
                        maxLength={35}
                        // autocomplete
                        placeholder="Textbox for admin to list employee emails with comma as delimiter"
                        autofocus={false}
                        />
                                          
                </div>
                <div className={styles['invite__template-block']}>
                    <h4 className={styles['template-block__header']}>Email text to participants</h4> 
                    <textarea
                        className={styles['invite__template-content']}
                        placeholder="Enter email addresses (comma separated)"
                        value={followTextValue}
                        onChange={(e) => setFollowTextValue(e.target.value)}
                    />
                </div>
                <button className={`button-clean ${styles.sendBtn}`} onClick={sendInvites}>Invite</button>
                <div className={styles['template-btn__wrapper']}>
                    <span>
                        <Button variant='contained' onClick={() => openCreateTemplate()} className={styles['template-btn']}>Create Email Template</Button>
                    </span>
                    <select 
                        className={styles.templateSelect} 
                        onChange={handleTemplateSelectChange} 
                        disabled={emailTemplates.length === 0} 
                        value={selectedTemplateOption.templateName} 
                        name="existingPrograms" id="existingPrograms"
                    >
                    {emailTemplates.length === 0 && <option value="" disabled>No templates</option>}
                        {emailTemplates.map(template => {
                            if (template.templateName === '') return <option 
                            key={'select_template_input'} 
                            value=''
                            disabled>
                                Choose a template
                            </option>
                            return <option 
                                    key={template.templateName} 
                                    value={template.templateName}>
                                        {template.templateName}
                                    </option>
                        })}

                    </select>
                </div>
            </div>
            <Backdrop
            open={showLoader}
            sx={{zIndex: 11, color: '#fe9236'}}
        >
            <h3 style={{marginRight: '1rem'}}>Inviting users...</h3>
            <br />
            <CircularProgress color="inherit" />
        </Backdrop>
        </>
    )
}

export default AppTemplateHOC(InviteParticipants)