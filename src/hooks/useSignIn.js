
import React, { useState, useEffect } from 'react'
//google signin
import { signInWithRedirect, getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';




function useSignIn() {
    const [user, setUser] = useState(null)

    //google sign in with redirect
    const googleSignIn = () => {
        // This will trigger a full page redirect away from your app
        signInWithRedirect(auth, GoogleProvider)
    }

    const facebookSignIn = () => {
        signInWithRedirect(auth, FacebookProvider)
    }

    const twitterSignIn = () => {
        signInWithRedirect(auth, TwitterProvider)
    }
    const githubSignIn = () => {
        signInWithRedirect(auth, GithubProvider)
    }

    //auth/login state change
    useEffect(() => {
        const loginState = onAuthStateChanged(auth, (user) => {
            console.log(user)
            if (user) {
                const userRef = doc(db, "users", user.uid);

                getDoc(userRef).then((doc) => {
                    const userExists = doc.exists();
                    if (userExists) {
                        setUser({ displayName: doc.data().displayName, profileURL: doc.data().profileURL, uid: doc.data().uid, createdAt: doc.data().createdAt.seconds, status: doc.data().status })
                    } else {
                        setDoc(userRef, {
                            displayName: user.displayName,
                            email: user.email ? user.email : "",
                            profileURL: user.photoURL,
                            userId: user.uid,
                            createdAt: Timestamp.fromDate(new Date()),
                            status: "online",
                            friends: [],
                        }).then((doc) => {
                            setUser({ displayName: doc.data().displayName, profileURL: doc.data().profileURL, uid: doc.data().uid, createdAt: doc.data().createdAt.seconds, status: doc.data().status })
                        })
                    }
                })


                navigate('/channels')
            } else {
                updateDoc(doc(db, "users", user.uid), {
                    status: "offline",
                })
                setUser({ displayName: null, profileURL: null, uid: null, status: null })
                navigate('/')

            }

        })

        return () => {
            loginState();
        }

    }, [auth])

    return [user, googleSignIn, facebookSignIn, twitterSignIn, githubSignIn]
}

export default useSignIn

