import { useState, useEffect, createContext } from "react";
import { auth } from './../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const UserAuthContext = createContext(null);

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            console.log('User status changed: ', user);
            if (user) {
                setUser(user)
            } else {
              setUser(null)
            }
          })
    }, []);

    return (
        <UserAuthContext.Provider value={{user, setUser}}>
            {children}
        </UserAuthContext.Provider>
    )
}

export default AuthProvider;