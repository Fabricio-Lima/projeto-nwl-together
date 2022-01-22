import React, { createContext, ReactNode, useState, useContext } from 'react'
import { firebase, auth } from '../services/firebase'

type User = {
    id: string
    name: string
    avatar: string
}

type AuthContextType = {
    user: User | undefined
    signInWithGoogle: () => Promise<void>
}

type Props = {
    children: ReactNode;
};

const AuthContext = createContext({} as AuthContextType)


export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthContextProvider({ children }: Props) {
    
    const [ user, setUser ] = useState<User>()

    const signInWithGoogle = async () => {
        const provider = new firebase.auth.GoogleAuthProvider()

        const result = await auth.signInWithPopup(provider)

        if(result.user){
            const { displayName, photoURL, uid } = result.user

            if(!displayName || !photoURL) {
                throw new Error('Missing Information from Google Account')
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    )
}