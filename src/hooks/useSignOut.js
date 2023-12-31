import React from 'react'
import { auth } from '../firebase'

function useSignOut(user) {
    //auth sign out function
    const signOut = () => {
        auth.signOut().then(() => {

            const userRef = doc(db, "users", user.uid)
            updateDoc(userRef, {
                status: "offline"
            })
        }).then(() => {
            navigate("/", { replace: true })
        })
    }
    return { signOut }
}

export default useSignOut