import {initializeApp} from 'firebase/app';
import { 
    getFirestore, 
    collection, 
    doc,
    getDoc,
    getDocs,
    limit,
    // randomly generates id for us
    addDoc,
    // requires id to be generated before sending
    setDoc,
    deleteDoc,
    onSnapshot,

    query,
    where,
    orderBy,
} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';

// init firebase app
const app = initializeApp( {
    apiKey: "AIzaSyCmUMFRH0f8b8ECmXjGA4FeNzH146CNmnk",
    authDomain: "meetupmatch-28f88.firebaseapp.com",
    databaseURL: "https://meetupmatch-28f88-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "meetupmatch-28f88",
    storageBucket: "meetupmatch-28f88.appspot.com",
    messagingSenderId: "626631498056",
    appId: "1:626631498056:web:15a79fab59d43c593f3b7d"
    });


    
// init firebase app
// const app = initializeApp(firebaseConfig);

// init services
const db = getFirestore(app);

export const auth = getAuth();

// specific collection ref
const programRef = collection(db, 'programs');
const emailTemplatesRef = collection(db, 'emailTemplates');
const usersRef = collection(db, 'users');

function createColRef (collectionName) {
    switch (collectionName) {
        case 'PROGRAMS':
            return query(programRef, orderBy("programName"));
        case 'EMAIL_TEMPLATES':
            return query(emailTemplatesRef, orderBy("templateName", "asc"));
        case 'USERS':
            return query(usersRef);
        default:
            return;
    }
}

// queries


// const q = query(programRef, orderBy("programName", "asc"));

const collectionObj = {
    PROGRAMS: programRef,
    EMAIL_TEMPLATES: emailTemplatesRef,
    USERS: usersRef,
}

export const getSingleEntity = async (docToFind) => {
    // let collectionRef = collectionObj[collectionName];

    // const docRef = query(usersRef, where('id', '===', docToFind));
    // const docRef = doc(db, 'users', 'AkZC7x5cmRB7hEbloP09');
    // const docRef = doc(query(usersRef, where('id', '===', docToFind)));
    console.log(docToFind, 'docToFind');
    const qu = query(usersRef, where("text", "==", docToFind), limit(1));
    const docSnap = await getDocs(qu);
    // const docSnap = await getDoc(docRef);
    console.log( docSnap.docs, 'docSnapdocSnapdocSnap');

   

    if (!docSnap.empty) {
        // The query returned at least one document
        console.log(docSnap.docs[0].ref, 'refffff');
        return docSnap.docs[0].data();
      } else {
        // No documents matched the query
        console.log("No matching documents found!");
        return null;
      }
}


// get collection data
export const getEntities = (collectionName) => {
    let collectionRef = collectionObj[collectionName];
    let q = createColRef(collectionName);

    return getDocs(q, collectionRef)
        .then((snapshot) => {
            // snapshot.docs return whole big obj whith our data deep down
            // console.log(snapshot.docs, 'See our programs')
            let entities = [];
            snapshot.docs.forEach((doc) => {
                entities.push({...doc.data(), id: doc.id})
            })
            return entities;
        })
        .catch(err => {
            console.warn(err, 'error');
        });
}

// onSnapshot(programRef, (snapshot) => {
//     let entities = [];
//     snapshot.docs.forEach((doc) => {
//         entities.push({...doc.data(), id: doc.id})
//     })
//     console.log('Changes in program collection spotted!', entities);
// })

export const addEntity = (newEntity, collectionName) => {
    let collectionRef = collectionObj[collectionName];

    console.log(newEntity, 'newEntity');

    addDoc(collectionRef, newEntity)
        .then(() => console.log(newEntity, 'newEntity'))
        .catch((error) => console.log(error, 'error'));
}

export const deleteEntity = (curEntityId, cb) => {
    // let collectionRef = collectionObj[collectionName];

    const docRef = doc(db, 'programs', curEntityId)

    deleteDoc(docRef)
        .then((res) => {
            console.log(res, 'DELETION RESULT');
            cb();
        })
        .catch(err => console.warn(err, 'Error'))

}


    
